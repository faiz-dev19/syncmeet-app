// // export default videoMeetCompomemt

import React, { useEffect, useRef, useState } from 'react';
import "../styles/videoMeet.css";
import { Badge, TextField, Button } from '@mui/material';
import { io } from "socket.io-client";
// import MicIcon from '@mui/icons-material/Mic';
// import MicOffIcon from '@mui/icons-material/MicOff';
// import VideocamIcon from '@mui/icons-material/Videocam';
// import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
// import IconButton from '@mui/material/IconButton';

import IconButton from '@mui/material/IconButton';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';

import ChatIcon from '@mui/icons-material/Chat';


const server_url = 'http://localhost:8000';

var connections = {}

const peerConfigConnections = {
  "iceServers": [
    { "urls": "stun:stun.l.google.com:19302" }
  ]
}

export default function VideoMeetComponent() {

  const attachStream = (videoEl, stream) => {
  if (videoEl && stream) {
    videoEl.srcObject = stream;
    videoEl.play().catch(() => {});
  }
};

  var socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoRef = useRef();

  const [videoAvailable, setVideoAvailable] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);

  // ✅ FIXED (was wrong type)
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);

  const [screen, setScreen] = useState(false);

  // const [showModel, setShowModel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState();
  // const [screenSharing, setScreenSharing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [newMessages, setNewMessages] = useState(3);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");

  const videoRef = useRef([])

  const [videos, setVideos] = useState([]);

  const getPermissions = async () => {
    console.log("INSIDE GET PERMISSIONS");
    try {
      // ✅ SIMPLIFIED (avoid async state issue)
      const userMediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      window.localStream = userMediaStream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = userMediaStream;
      }
      setVideoAvailable(true);
      setAudioAvailable(true);
      setScreenAvailable(true);

      setVideo(true);
      setAudio(true);

      console.log("PERMISSION SUCCESS");
    } catch (error) {
      console.log(error)
      setVideoAvailable(false);
      setAudioAvailable(false);
    }
  }

  useEffect(() => {
    getPermissions();
  }, [])

  let getUserMediaSuccess = (stream) => {

    // ✅ FIXED (always set stream)
    // if (window.localStream) {
    //   window.localStream.getTracks().forEach(track => track.stop());
    // }

    window.localStream = stream;
    attachStream(localVideoRef.current, stream);

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      // ❌ OLD (REMOVE THIS)
      // connections[id].addStream(window.localStream)

      // ✅ FIX
      window.localStream.getTracks().forEach((track) => {
        connections[id].addTrack(track, window.localStream);
      });

      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description).then(() => {
          socketRef.current.emit(
            "signal",
            id,
            JSON.stringify({ sdp: connections[id].localDescription })
          );
        });
      });
    }
    stream.getTracks().forEach(track => track.onended = () => {
      setVideo(false)
      setAudio(false)

      try {
        let track = localVideoRef.current.srcObject.getTracks()
        track.forEach(track => track.stop())
      } catch (e) {
        console.log(e)
      }

      // let blackSilence = (...args) => new MediaStream([black(...args), silence()])
      // window.localStream = blackSilence();
      // localVideoRef.current.srcObject = window.localStream;

      for (let id in connections) {
        connections[id].addStream(window.localStream)
        connections[id].createOffer().then((description) => {
          connections[id].setLocalDescription(description).then(() => {
            socketRef.current.emit("signal", id, JSON.stringify({ "signal": connections[id].localDescription }))
          }).catch(e => console.log(e))
        })
      }
    })
  }

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume()
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
  }

  // ✅ FIXED black() function
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return stream.getVideoTracks()[0];
  }

  let getUserMedia = () => {

    console.log("VIDEO =", video);
    console.log("AUDIO =", audio);
    console.log("VIDEO AVAILABLE =", videoAvailable);
    console.log("AUDIO AVAILABLE =", audioAvailable);

    if (!localVideoRef.current) {
      return;
    }

    if ((video && videoAvailable) || (audio && audioAvailable)) {

      console.log("CALLING GET USER MEDIA");

      navigator.mediaDevices.getUserMedia({
        video: video,
        audio: audio
      })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e))
    }
  }



  // useEffect(() => {

  //   console.log("USE EFFECT FIRED");

  //   console.log("VIDEO =", video);
  //   console.log("AUDIO =", audio);

  //   getUserMedia();

  // }, [audio, video]);


  useEffect(() => {
    console.log("USE EFFECT FIRED");
    if (video === false && audio === false) {
      return;
    }

    getUserMedia();
    // getPermissions();

  }, [audio, video]);

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {

      if (signal.sdp) {
        // ✅ FIXED typo formId → fromId
        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
          if (signal.sdp.type === 'offer') {
            connections[fromId].createAnswer().then((description) => {
              connections[fromId].setLocalDescription(description).then(() => {
                socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
              }).catch(e => console.log(e))
            }).catch(e => console.log(e))
          }
        }).catch(e => console.log(e))
      }

      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
      }
    }
  }

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data }
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };



  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false })
    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {

      socketRef.current.emit("join-call", window.location.href)

      socketIdRef.current = socketRef.current.id
      socketRef.current.on("chat-message", addMessage)

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id))
      })

      socketRef.current.on("user-joined", (id, clients) => {

        console.log("USER JOINED:", id, clients);

        (clients || []).forEach((socketlListId) => {

          // ✅ IMPORTANT FIX
          // stop duplicate peer connections
          if (connections[socketlListId]) return;

          // create new peer connection
          connections[socketlListId] =
            new RTCPeerConnection(peerConfigConnections);

          // ice candidate
          connections[socketlListId].onicecandidate = (event) => {

            if (event.candidate != null) {

              socketRef.current.emit(
                "signal",
                socketlListId,
                JSON.stringify({
                  ice: event.candidate
                })
              );
            }
          };

          // receive remote stream
          connections[socketlListId].ontrack = (event) => {

            const remoteStream = event.streams[0];

            let videoExists =
              videoRef.current.find(
                (video) =>
                  video.socketId === socketlListId
              );

            if (videoExists) {

              setVideos((videos) => {

                const updatedVideos =
                  videos.map((video) =>
                    video.socketId === socketlListId
                      ? {
                        ...video,
                        stream: remoteStream
                      }
                      : video
                  );

                videoRef.current =
                  updatedVideos;

                return updatedVideos;
              });

            } else {

              const newVideo = {
                socketId: socketlListId,
                stream: remoteStream
              };

              setVideos((videos) => {

                const updatedVideos = [
                  ...videos,
                  newVideo
                ];

                videoRef.current =
                  updatedVideos;

                return updatedVideos;
              });
            }
          };

          // add local stream
          if (window.localStream) {

            window.localStream?.getTracks().forEach((track) => {
              connections[socketlListId].addTrack(track, window.localStream);
            });
          }
        });

        // create offer
        if (id === socketIdRef.current) {

          for (let id2 in connections) {

            if (id2 === socketIdRef.current)
              continue;

            connections[id2]
              .createOffer()
              .then((description) => {

                connections[id2]
                  .setLocalDescription(description)
                  .then(() => {

                    socketRef.current.emit(
                      "signal",
                      id2,
                      JSON.stringify({
                        sdp: connections[id2]
                          .localDescription
                      })
                    );

                  })
                  .catch((e) => console.log(e));

              })
              .catch((e) => console.log(e));
          }
        }
      });
    })
  }

  let getMedia = () => {

    console.log("BEFORE", video, audio);

    setVideo(true);
    setAudio(true);

    console.log("AFTER", video, audio);

    connectToSocketServer();
  }

  let connect = () => {
    setAskForUsername(false)
    getMedia();
  }


  const toggleVideo = async () => {
    let videoTrack = window.localStream?.getVideoTracks()[0];

    // ✅ Case 1: track exists → just toggle
    if (videoTrack) {
      if (videoTrack.readyState === "live") {
        videoTrack.enabled = !videoTrack.enabled;
        setVideo(videoTrack.enabled);
        return;
      }
    }

    // 🔁 Case 2: track dead or missing → recreate
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const newTrack = newStream.getVideoTracks()[0];

      // add new track
      window.localStream.addTrack(newTrack);

      // attach to video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = window.localStream;
      }

      setVideo(true);

    } catch (err) {
      console.log("Error restarting camera:", err);
    }
  };

  const toggleAudio = async () => {


    let audioTrack = window.localStream?.getAudioTracks()[0];

    // ✅ Case 1: track exists & alive → toggle
    if (audioTrack && audioTrack.readyState === "live") {
      audioTrack.enabled = !audioTrack.enabled;
      setAudio(audioTrack.enabled);
      return;
    }

    // 🔁 Case 2: track missing or dead → recreate mic
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newTrack = newStream.getAudioTracks()[0];

      window.localStream.addTrack(newTrack);

      setAudio(true);

      console.log("Mic restarted");
    } catch (err) {
      console.log("Mic error:", err);
    }
  };
  // screen share

  // const replaceVideoTrack = (newTrack) => {
  //   Object.values(connections).forEach((peer) => {
  //     const sender = peer.getSenders().find((s) => {
  //       return s.track && s.track.kind === "video";
  //     });

  //     if (sender) {
  //       sender.replaceTrack(newTrack);
  //     } else {
  //       console.log("No video sender found");
  //     }
  //   });
  // };
const replaceVideoTrack = (newTrack) => {
  Object.values(connections).forEach((peer) => {
    const sender = peer.getSenders().find((s) => s.track && s.track.kind === "video");

    if (sender) {
      sender.replaceTrack(newTrack);
    }
  });
};
  // const videoRef = useRef([]);
  const screenTrackRef = useRef(null);

const stopScreenShare = async () => {
  try {
    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    window.localStream = cameraStream;

    localVideoRef.current.srcObject = cameraStream;

    for (let id in connections) {
      connections[id].addStream(cameraStream);

      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description).then(() => {
          socketRef.current.emit(
            "signal",
            id,
            JSON.stringify({
              sdp: connections[id].localDescription,
            })
          );
        });
      });
    }

    setScreen(false);
  } catch (err) {
    console.log("STOP SCREEN ERROR:", err);
  }
};


 const handleScreen = async () => {
  try {
    if (!screen) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      window.localStream = screenStream;

      localVideoRef.current.srcObject = screenStream;

      // send FULL stream again to peers
      for (let id in connections) {
        connections[id].addStream(screenStream);

        connections[id].createOffer().then((description) => {
          connections[id].setLocalDescription(description).then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({
                sdp: connections[id].localDescription,
              })
            );
          });
        });
      }

      setScreen(true);

      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } else {
      stopScreenShare();
    }
  } catch (err) {
    console.log("SCREEN ERROR:", err);
  }
};

  let handleEndCall = () => {
  try {
    let tracks = localVideoRef.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  } catch (e) {}

  window.location.href = "/";
};
setTimeout(() => {
  attachStream(localVideoRef.current, window.localStream);
}, 200);
  let sendMessage = () => {
    console.log(socketRef.current);
    socketRef.current.emit('chat-message', message, username)
    setMessage("");
  }
  // console.log("hello faiz");

  return (

    <div className="container">

      {askForUsername ? (

        <div className="lobby">

          <div className="card">

            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="preview"
            />

            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />

            <button onClick={connect} className="btn">
              Join Meeting
            </button>

          </div>

        </div>

      ) : (

        <div className="meeting">

          {showModal ? <div className="chatRoom">

            <div className="chatContainer">
              <h1>Chat</h1>

              <div className="chattingDisplay">

                {messages.length !== 0 ? messages.map((item, index) => {

                  console.log(messages)
                  return (
                    <div style={{ marginBottom: "20px" }} key={index}>
                      <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                      <p>{item.data}</p>
                    </div>
                  )
                }) : <p>No Messages Yet</p>}


              </div>

              <div className="chattingArea">
                {/* {message} */}
                <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Enter Your chat" variant="outlined" />
                <Button variant='contained' onClick={sendMessage}>Send</Button>
              </div>

            </div>
          </div> : <></>}
          {/* </div> */}



          <div className="videoGrid">

            {/* Local */}
            <div className="myVideo">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
              />
              <span>You</span>
            </div>

            {/* Remote */}
            {videos.map((video) => (
              <div className='videowrapper' key={video.socketId}>
                <video
                  data-scoket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  playsInline
                />
                {/* <span>{video.socketId}</span> */}
              </div>
            ))}

          </div>



          <div className="controls">

            {/* Audio */}
            <IconButton onClick={toggleAudio} className="controlBtn">
              {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {/* Video */}
            <IconButton onClick={toggleVideo} className="controlBtn">
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton
              onClick={handleScreen}
              className="controlBtn"
            >
              {
                screen
                  ? <StopScreenShareIcon />
                  : <ScreenShareIcon />
              }
            </IconButton>



            <IconButton onClick={handleEndCall} className="controlBtn endCall">
              <CallEndIcon />
            </IconButton>

            {/* Chat */}
            <div className="chatWrapper" >
              {/* <IconButton onClick={() => setShowModel(!showModel)} className="controlBtn">
      <ChatIcon />
    </IconButton>

    {newMessages > 0 && (
      <span className="badge">{newMessages}</span>
    )} */}
              <Badge badgeContent={newMessages} max={999} color='orange'>
                <IconButton onClick={() => setShowModal(!showModal)} style={{ color: "white" }}>
                  <ChatIcon /> </IconButton>
              </Badge>
            </div>

          </div>

        </div>

      )}

    </div>
  )
}
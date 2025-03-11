'use client';
import Peer from "peerjs";
import { useRef, useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState(null);
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();

  let peer = null;
  let local_stream = null;
  let currentPeer = null;

  const createRoom = () => {
    console.log(roomId);
    peer = new Peer(roomId);
    peer.on('open', (id) => {
      console.log('Peer Room Id:', id);
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        console.log(stream);
        local_stream = stream;
        console.dir(localStreamRef.current);
        const video = localStreamRef.current;
        video.srcObject = stream;
        // video.muted = true;
        video.play();
      }).catch((e) => console.log(e));

    });
    peer.on('call', (call) => {
      console.log({ call });
      call.answer(local_stream);
      call.on('stream', (stream) => {
        console.log('got call');
        console.log({ "callStrem:": stream });
        const video = remoteStreamRef.current;
        video.srcObject = stream;
        video.muted = true;
        video.play();
      });
      currentPeer = call;
    })
  }
  const joinRoom = () => {
    peer = new Peer();
    peer.on('open', (id) => {
      console.log('Connected room with id:' + id);

      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        local_stream = stream;
        const video = localStreamRef.current;
        video.srcObject = stream;
        console.log({ roomId });
        let call = peer.call(roomId, stream);
        call.on('stream', (stream) => {
          const video = remoteStreamRef.current;
          video.srcObject = stream;
          video.play();
        })
        currentPeer = call
      }).catch((e) => console.log(e))
    })
  }
  return (
    <div>
      Peeer js connection!
      <div className="space-y-2 flex flex-col items-center justify-center">
        <input onChange={(e) => setRoomId(e.target.value)} defaultValue={1} placeholder="room number" className="outline-0 border border-blue-500 h-10 px-2 rounded-xl" />
        <div className="flex space-x-2">
          <button className="border border-green-500 p-3 rounded-2xl cursor-pointer" onClick={createRoom}>Create</button>
          <button onClick={joinRoom} className="border border-blue-500 p-3 rounded-2xl cursor-pointer">Join</button>
        </div>
      </div>
      <div>
        <div>
          <h1>Set Local Stream</h1>
          <div className="flex space-x-2">
            <video height="300" ref={localStreamRef} controls></video>
            <video height="300" ref={remoteStreamRef} controls></video>
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  );
}

document.addEventListener('DOMContentLoaded', function () {
    // Elements for video call
    const videoCallButton = document.getElementById('startVideoCall');
    const videoCallContainer = document.getElementById('videoCallContainer');
    const videoElement = document.getElementById('videoElement');
    const localStream = new MediaStream();
    const remoteStream = new MediaStream();
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const sendMessageButton = document.getElementById('sendMessage');
    const documentUploadInput = document.getElementById('documentUpload');
    const documentList = document.getElementById('documentList');

    let peerConnection;
    const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    // Initialize WebRTC connection
    function initWebRTC() {
        peerConnection = new RTCPeerConnection(configuration);

        peerConnection.ontrack = function (event) {
            remoteStream.addTrack(event.track);
            videoElement.srcObject = remoteStream;
        };

        peerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                // Send candidate to the other peer
            }
        };

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
    }

    // Start video call
    videoCallButton.addEventListener('click', async function () {
        try {
            // Get local media stream
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStream.addTrack(stream.getVideoTracks()[0]);
            localStream.addTrack(stream.getAudioTracks()[0]);

            videoElement.srcObject = localStream;
            videoCallContainer.style.display = 'block';

            initWebRTC();
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    });

    // Send chat message
    sendMessageButton.addEventListener('click', function () {
        const message = chatInput.value;
        if (message) {
            // Display message in chat container
            const messageElement = document.createElement('p');
            messageElement.textContent = `Doctor: ${message}`;
            chatContainer.appendChild(messageElement);

            // Send message to patient
            chatInput.value = '';
        }
    });

    // Handle document upload
    documentUploadInput.addEventListener('change', function () {
        const files = documentUploadInput.files;
        if (files.length > 0) {
            const file = files[0];
            const listItem = document.createElement('li');
            listItem.textContent = file.name;
            documentList.appendChild(listItem);

            // Handle file upload to server
            const formData = new FormData();
            formData.append('file', file);

            fetch('/uploadDocument', {
                method: 'POST',
                body: formData
            }).then(response => response.json())
              .then(data => {
                  console.log('Document uploaded successfully:', data);
              }).catch(error => {
                  console.error('Error uploading document:', error);
              });
        }
    });
});
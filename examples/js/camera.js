      // Camera status
      let cameraEnabled = true;
      // Camera button element
      const cameraBtnEle = document.getElementById('camera-btn');

      // Screen share status
      let screenEnabled = false;
      // Screen share button element
      const screenBtnEle = document.getElementById('screen-btn');

      // On mobile remove elements that are resource heavy
      const isMobile = AFRAME.utils.device.isMobile();

      if (isMobile) {
        const particles = document.getElementById('particles');
        particles.parentNode.removeChild(particles);
      }

      // Called by Networked-Aframe when connected to server
      function onConnect() {
        console.log('onConnect', new Date());

        // Handle camera button click (Off and On)
        cameraBtnEle.addEventListener('click', function () {
          NAF.connection.adapter.enableCamera(!cameraEnabled);
          cameraEnabled = !cameraEnabled;
          cameraBtnEle.textContent = cameraEnabled ? 'Desativar Câmera' : 'Mostrar Câmera';
        });

        // Handle screen button click (Off and On)
        screenBtnEle.addEventListener('click', function () {
          if (screenEnabled) {
            NAF.connection.adapter.removeLocalMediaStream('screen');
            screenEnabled = false;
            screenBtnEle.textContent = 'Compartilhar Tela';
          } else {
            navigator.mediaDevices.getDisplayMedia().then((stream) => {
              NAF.connection.adapter.addLocalMediaStream(stream, 'screen');
              stream.getVideoTracks().forEach((track) => {
                track.addEventListener(
                  'ended',
                  () => {
                    NAF.connection.adapter.removeLocalMediaStream('screen');
                    screenEnabled = false;
                    screenBtnEle.textContent = 'Share screen';
                  },
                  { once: true }
                );
              });
              screenEnabled = true;
              screenBtnEle.textContent = 'Stop Screen';
            });
          }
        });
      }
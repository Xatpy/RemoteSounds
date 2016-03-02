      function registerNewSound(){
        console.log(document.getElementById("regSoundURL").value);
        socket.emit('registerSound', document.getElementById("regSoundURL").value);
      }

      function playSound(id) {
        console.log("hola");
        if ((dictSounds[id] === null) || (dictSounds[id] === undefined)) {
          console.log("Sound " + id + " is not loaded.");
          return;
        }

        if (!dictSounds[id].sound.paused) {
          //is playing
          dictSounds[id].sound.cloneNode(true).play();
        } else {
          dictSounds[id].sound.play();          
        }
      }

      function addSound(obj) {
        //debugger
        obj.sound = new Audio(obj.sound);
        dictSounds.push(obj);
        /*dictSounds[id] = obj;
        obj.id = id;
        obj.name = list[i].name;
        obj.sound = new Audio(list[i].sound); 
        obj.img = list[i].img;*/
      }

      function loadSound(id, url){
        dictSounds[id] = new Audio(url);
      }

      var dictSounds = [];
      /*
      (function loadInitialSounds(){
        loadSound("a", "media/glass.mp3")
        loadSound("b", "media/laugh.mp3")
      })();
      */

      function initSounds(serverSounds){
        //debugger
        var list = serverSounds.listSounds;
        for (var i = 0; i < list.length; ++i) {
          var id = list[i].id;
          if ( (dictSounds[id] === null) || (dictSounds[id] === undefined) )
          {
            addSound(list[i]);
          }
        }
      }
      
      var socket = io();

      // Load initial sound when new session
      socket.on('newConnection', function(msg){
        console.log("new connection");
        //debugger
        initSounds(msg);
      });

      // Register new sound
      $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });

      // Load new sound event
      socket.on('newSound', function(msg){
        addSound(msg);
      });      

      // Chat message
      socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
        playSound(msg);
      });





      // freewall
      var colour = [
        "rgb(142, 68, 173)",
        "rgb(243, 156, 18)",
        "rgb(211, 84, 0)",
        "rgb(0, 106, 63)",
        "rgb(41, 128, 185)",
        "rgb(192, 57, 43)",
        "rgb(135, 0, 0)",
        "rgb(39, 174, 96)"
      ];

      $(".brick").each(function() {
        this.style.backgroundColor =  colour[colour.length * Math.random() << 0];
      });

      $(function() {
        var wall = new Freewall("#freewall");
        wall.reset({
          selector: '.brick',
          animate: true,
          cellW: 160,
          cellH: 160,
          delay: 50,
          onResize: function() {
            wall.fitWidth();
          }
        });
        wall.fitWidth();
        var temp = '<div class="brick {size}" style="background-color: {color}"><div class="cover"><input type="image" src="{image}" alt="Submit" width="48" height="48"></div></div>';
        $(".add-more").click(function() {
          var html = "";
          for (var i = 0; i < 1; ++i) {
            debugger
            html += temp.replace('{size}', 'size11')
                  .replace('{color}', colour[colour.length * Math.random() << 0])
                  .replace('{image}', "http://www.echoecho.com/i/rainbow.gif");
          }
          wall.appendBlock(html);
        });
      });

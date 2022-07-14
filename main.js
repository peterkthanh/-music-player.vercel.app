/* 1 . Render Songs
2. Scroll top 
3. Play/ pause / seek 
4. CD rdate 
5. Next / prev 
6. Random
7. Next / Repeat When ended
8. Active song
9. Scroll active song into
10. Play song when click  */

const PLAYER_STORAGE_KEY = 'F8-PLAYER'

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $('.player');
const cd = $(".cd");
const heading = $("header h2");
const cbThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $('.btn-toggle-play')
const progress = $("#progress");
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $(".playlist");

const songs = [
    {
        name: "on second thought 🍉 by Strange Fruits",
        singer: "Gill Chang",
        path: "./assets/music/Song1.mp3",
        image: "./assets/img/song1.jpg",
    },
    {
        name: "Cold Drinks & Cool Friends",
        singer: "(feat. Akacia) by LIHO",
        path: "./assets/music/Song2.mp3",
        image: "./assets/img/song2.jpg",
    },
    {
        name: "I CAN T FIND YOU ",
        singer: "HOAPROX by Soap Music-Song3",
        path: "./assets/music/Song3.mp3",
        image: "./assets/img/song3.jpg",
    },
    {
        name: "NHOI NHOI NHOI (Remix) ",
        singer: "SONBEAT ft DATWEE by D A T W E E",
        path: "./assets/music/Song4.mp3",
        image: "./assets/img/song4.jpg",
    },
    {
        name: "Mashup Đi Đi Đi x Nevada",
        singer: "Daniel Mastro Mashup Remix by LX ✪",
        path: "./assets/music/Song5.mp3",
        image: "./assets/img/song5.jpg",
    },
    {
        name: "Bên Trên Tầng Lầu ( Huyn remix )",
        singer: "Tăng Duy Tân by Nguyễn Minh Huy ",
        path: "./assets/music/Song6.mp3",
        image: "./assets/img/song6.jpg",
    },
];

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "on second thought 🍉 by Strange Fruits",
            singer: "Gill Chang",
            path: "./assets/music/Song1.mp3",
            image: "./assets/img/song1.jpg",
        },
        {
            name: "Cold Drinks & Cool Friends",
            singer: "(feat. Akacia) by LIHO",
            path: "./assets/music/song2.mp3",
            image: "./assets/img/song2.jpg",
        },
        {
            name: "I CAN T FIND YOU ",
            singer: "HOAPROX by Soap Music-Song3",
            path: "./assets/music/song3.mp3",
            image: "./assets/img/song3.jpg",
        },
        {
            name: "NHOI NHOI NHOI (Remix) ",
            singer: "SONBEAT ft DATWEE by D A T W E E",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/song4.jpg",
        },
        {
            name: "Mashup Đi Đi Đi x Nevada",
            singer: "Daniel Mastro Mashup Remix by LX ✪",
            path: "./assets/music/song5.mp3",
            image: "./assets/img/song5.jpg",
        },
        {
            name: "Bên Trên Tầng Lầu ( Huyn remix )",
            singer: "Tăng Duy Tân by Nguyễn Minh Huy ",
            path: "./assets/music/song6.mp3",
            image: "./assets/img/song6.jpg",
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    //RENDER Songs
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div
                  class="thumb"
                  style="background-image: url('${song.image}')">
                  </div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              </div>
              `
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });

    },

    //2. Scroll top
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xử lý CD quay và dừng 
        const cbThumbAnimate = cbThumb.animate([
            { transform: 'rotate(360deg)' }

        ], {
            duration: 10000, /// 10 seconds
            iterations: Infinity, /// vo han
        })
        cbThumbAnimate.pause();




        // xử lý phóng to / thủ nhỏ
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;

            cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
            cd.style.opacity = newcdWidth / cdWidth;
        },
            // xử lý khi click play playBtn

            playBtn.onclick = function () {
                if (_this.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();

                }
            }
        // xử lý khi click play playBtn
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cbThumbAnimate.play();

        }
        //Xử lý khi click pause playBtn
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cbThumbAnimate.pause();
        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            } else { }

        }
        // Xử lý khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime
        }
        //lang nghe xu kien next
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong()
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //lang nghe xu kien prevSong
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }


        //lang nghe su kien random, bat tat random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);

        }


        //lang nghe su kien lap lai mot  repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = ~_this.isRepeat;
            _this.setConfig('repeat', _this.isRepeat);

            repeatBtn.classList.toggle('active', _this.isRepeat);
        }


        //lang nghe su kien next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        //lang nghe su kien click vao playlist
        // hoc nang cao ve  closest
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {

                //xu ly khi click vao song
                if (songNode) {
                    //note nho su dung
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();

                }
                //xu ly khi click vao song option
                if (e.target.closest('.song:not(.active)')) {

                }
            }
        }


    },
    //-------------------------------------------------------------
    //tai thong tin len UI
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cbThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300);
    },
    //Xu ly chuyen bai Next
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    //Xu ly chuyen bai presong
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    //xu ly ramdom song
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();



    },

    start: function () {
        //Gán cấu hình từ config vào object vào ứng dụng
        this.loadConfig();
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe  / xử lý các sự kiên(DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiền vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render Playlist(danh sách bài hát)
        this.render();
        //Hiện thị trạng thái ban đầu của button render và random
        /*     randomBtn.classList.toggle('active', this.isRandom);
            repeatBtn.classList.toggle('active', this.isRepeat); */
    },
};
app.start();

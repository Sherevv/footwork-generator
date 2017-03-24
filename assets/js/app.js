var app = angular.module('fwg', ['ngSanitize', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'btford.markdown', 'pascalprecht.translate', 'angular-loading-bar', 'ngCookies', 'angularAwesomeSlider'])
    .config(function ($httpProvider, $stateProvider, $urlRouterProvider, $translateProvider, $translatePartialLoaderProvider, $locationProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: true
        }).hashPrefix('!');

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'l10n/{part}/{lang}.json'
        });

        $stateProvider.state('app', {
            abstract: true,
            url: '/{lang:(?:ru|en)}',
            template: '<ui-view/>',
            params: {lang: 'ru'}
        }).state('app.main', {
            url: '',
            templateUrl: 'views/main.html',
            resolve: {
                specificTranslations: function (commonService) {
                    commonService.loadTranslate('main');
                }
            }
        }).state('app.changes', {
            url: '/changes',
            templateUrl: 'views/changes.html',
            resolve: {
                specificTranslations: function (commonService) {
                    commonService.loadTranslate('changes');
                }
            }
        }).state('app.description', {
            url: '/description',
            templateUrl: 'views/description.html',
            resolve: {
                specificTranslations: function (commonService) {
                    commonService.loadTranslate('description');
                }
            }
        }).state('app.about', {
            url: '/about',
            templateUrl: 'views/about.html',
            resolve: {
                specificTranslations: function (commonService) {
                    commonService.loadTranslate('about');
                }
            }
        }).state('app.exercises', {
            url: '/exercises',
            templateUrl: 'views/exercises.html',
            resolve: {
                specificTranslations: function (commonService) {
                    commonService.loadTranslate('exercises');
                }
            }
        });

        $translatePartialLoaderProvider.addPart('common');

        $translateProvider.preferredLanguage('ru');

        $urlRouterProvider.otherwise('/ru');

    })
    .controller('GeneratorController', function ($scope, $rootScope, $cookies, soundService) {

        $rootScope.version = '1.1.0';

        $scope.oneAtATime = true;
        $scope.beats = [];
        $scope.beats_on = false;

        $scope.options = {
            bit_count: 8,
            evenness: 'even',
            rock_step: true,
            step_names: true,
            step_bits: true,
            show_triple: true,
            couple: true,
            sound: {
                isRhythmer: true,
                bpm: 130
            },
            kick_instead_hold: false
        };

        $scope.classes = [
            {num: 0, class: 'white', step: 'hold'},
            {num: 1, class: 'blue', step: 'step'},
            {num: 2, class: 'red', step: 'bllch'}
        ];
        $scope.cards = [];

        $scope.initState = function () {
            if ($cookies.get('ver') == $rootScope.version) {
                var opt = $cookies.getObject('options');
                if (opt)
                    $scope.options = opt;
                else
                    $cookies.putObject('options', $scope.options);
                var cnums = $cookies.getObject('nums');
            } else {
                $cookies.put('ver', $rootScope.version);
                $cookies.putObject('options', $scope.options);
            }

            $scope.generate(cnums);

            $scope.$watch('options', function (newVal) {
                $cookies.putObject('options', newVal);
            }, true);

        };
        $scope.toggleSound = function () {
            soundService.toggleSound();
        };

        $scope.generate = function (nums) {

                var use_old_nums=false;
                if(nums && nums.length>0){
                    use_old_nums=true;
                }

                $scope.cards = [];
                $scope.beats = [];
                var sum = 0;
                var num = 0;
                var num_arr = [];
                for (var i = 0; i < $scope.options.bit_count; i++) {

                    if(!use_old_nums) {
                        if ($scope.options.rock_step && i < 2)
                            num = 1;
                        else if ($scope.options.evenness !== 'no' && i === ($scope.options.bit_count - 1)) {
                            if ($scope.options.evenness === 'even') {
                                if (sum % 2 == 0) {
                                    num = $scope.getRandomFromArray([0, 2]);
                                }
                                else
                                    num = 1;

                            }
                            else {
                                if (sum % 2 == 0) {
                                    num = 1;
                                }
                                else
                                    num = $scope.getRandomFromArray([0, 2]);
                            }
                        }
                        else {
                            num = $scope.getRandomNumber(3) - 1;
                            if (num < 0)
                                num = 0;
                        }
                    }
                    else{
                        num = nums[i];
                    }

                    if (num == 1) {
                        $scope.beats[2 * i] = 0;
                        $scope.beats[2 * i + 1] = 1;
                    }
                    else if (num == 2) {
                        $scope.beats[2 * i] = 1;
                        $scope.beats[2 * i + 1] = 1;
                    }
                    else {
                        $scope.beats[2 * i] = 0;
                        $scope.beats[2 * i + 1] = 0;
                    }

                    var card = '';
                    card = angular.copy($scope.classes[num], card);
                    if (num == 0 && $scope.options.kick_instead_hold == true)
                        card.step = 'kick';
                    $scope.cards[i] = card;

                    if ($scope.options.couple) {
                        if (i % 2 == 0) {
                            $scope.cards[i].label_class = 'left-lbl';
                        }
                        else {
                            $scope.cards[i].label_class = 'right-lbl';
                        }
                    }

                    if ($scope.options.show_triple && (($scope.options.couple && i % 2 == 1) || (!$scope.options.couple && i > 0))) {
                        if (num == 2 && $scope.cards[i - 1].num == 1) {
                            $scope.cards[i - 1].step = 'triple';
                            $scope.cards[i - 1].label_class = 'left-lbl';
                            $scope.cards[i].step = 'step';
                            $scope.cards[i].label_class = 'right-lbl';
                        }
                    }
                    if ($scope.options.rock_step && i == 1 && $scope.options.couple) {
                        $scope.cards[i - 1].step = 'rock';
                        $scope.cards[i - 1].label_class = 'left-lbl';
                        $scope.cards[i].step = 'step';
                        $scope.cards[i].label_class = 'right-lbl';
                    }

                    sum = sum + num;
                    num_arr[i] = num;
                }
                $cookies.putObject('nums', num_arr);

        };
        $scope.getRandomNumber = function (num) {
            return (Math.ceil(Math.random() * num));
        };
        $scope.getRandomFromArray = function (arr) {
            return arr[Math.floor(Math.random() * (arr.length))];
        };

        $scope.$on('updateBeatsOn', function () {
            $scope.beats_on = soundService.beats_on;
        });

    });


app.controller('navigationController', function ($scope, $rootScope, $stateParams, $translate, $location) {

    $scope.setInit = function () {
        if ($stateParams.lang !== undefined) {
            var otherLang = $stateParams.lang === 'ru' ? 'en' : 'ru';
            $rootScope.activeLang = $stateParams.lang;
            var str = '/' + $stateParams.lang;
            if ($location.absUrl().indexOf(str) != -1)
                $rootScope.otherLangURL = $location.absUrl().replace(str, '/' + otherLang);
            else
                $rootScope.otherLangURL = '/en';
            $rootScope.otherLang = otherLang;
            $translate.use($stateParams.lang);
        } else {
            var otherLang = $stateParams.lang === 'ru' ? 'en' : 'ru';
            $stateParams.lang = 'ru';
            $rootScope.activeLang = 'ru';
            $rootScope.otherLangURL = '/en';
            $rootScope.otherLang = 'en';
            $translate.use('ru');
        }
    };

    $rootScope.$on('$stateChangeSuccess', function rootStateChangeSuccess(event, toState) {
        if ($stateParams.lang !== undefined) {
            var otherLang = $stateParams.lang === 'ru' ? 'en' : 'ru';
            $rootScope.activeLang = $stateParams.lang;
            $rootScope.otherLang = otherLang;
            var str = '/' + $stateParams.lang;
            if ($location.absUrl().indexOf(str) !== -1)
                $rootScope.otherLangURL = $location.absUrl().replace(str, '/' + otherLang);
            else
                $rootScope.otherLangURL = '/en';

            $translate.use($stateParams.lang);
        }
    });
});


app.run(function ($rootScope, cfpLoadingBar) {

    $rootScope.loadComplete = false;

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            $rootScope.loadComplete = false;
            cfpLoadingBar.start();
        });

});


app.controller('exercisesController', function ($scope) {
    $scope.status = {};
    $scope.status.open = [true];
    $scope.maxElem = 3;
    for (var i = 1; i <= $scope.maxElem; i += 1) $scope.status.open.push(false);
    $scope.collapseAccordion = function () {
        for (var i = 0; i < $scope.status.open.length; i += 1) $scope.status.open[i] = true;
    };
    $scope.unCollapseAccordion = function () {
        for (var i = 0; i < $scope.status.open.length; i += 1) $scope.status.open[i] = false;
    };

});

app.controller('soundController', function ($scope, $rootScope, $stateParams, $translate, $location, $timeout, soundService) {

    $scope.rate = 60000 / $scope.options.sound.bpm;

    $scope.isWebAudio = false;
    $scope.isFlashAudio = false;
    $scope.bpmOptions = {
        from: 30,
        to: 230,
        step: 1,
        css: {
            background: {"background-color": "silver"},
            before: {"background-color": '#f0ad4e'},// zone before default value
            //default: {"background-color": "white"}, // default value: 1px
            after: {"background-color": "#f0ad4e"},  // zone after default value
            pointer: {"background-color": "red"},   // circle pointer
            range: {"background-color": "red"} // use it if double value
        }
    };
    $scope.playingIDs = [];
    $scope.isWebAudio = true;
    $rootScope.isAudio = false;
    var metronomeBufferSource = null;
    $rootScope.metronomeSource = null;


    var audioContext = null;
    setupAudioContext = function () {
        try {
            if (typeof AudioContext !== 'undefined') {
                audioContext = new AudioContext();
            } else if (typeof webkitAudioContext !== 'undefined') {
                audioContext = new webkitAudioContext();
            } else {
                $scope.isWebAudio = false;
            }
        } catch (e) {
            $scope.isWebAudio = false;
        }
    };

    setupCodecs = function () {
        var audioTest = new Audio();
        var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');
        $scope.codecs = {
            mp3: !!(mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, '')),
            ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
            wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')
        };
    };

    $scope.initSound = function () {
        setupAudioContext();
        if (!$scope.isWebAudio) {
            $scope.soundLong = new Howl({
                urls: ['assets/sounds/kickLong.ogg', 'assets/sounds/kickLong.mp3'],
                onload: function () {
                    $scope.isHTML5Audio = true;
                    $rootScope.isAudio = true;
                },
                onloaderror: function () {
                    $scope.isHTML5Audio = false;
                    Fifer({
                        force: true, // force the use of the Flash fallback
                        swf: 'assets/js/fifer.fallback.swf' // set path to Flash fallback swf
                    }).loaded(function (files) {
                        $scope.isFlashAudio = true;
                        $rootScope.isAudio = true;
                    })
                        .registerAudio('beat', 'assets/sounds/kick.mp3', false);
                },
                onend: function () {
                    if (!$scope.beats_on)
                        $scope.stopSound();
                }
            });
        } else {
            $rootScope.isAudio = true;
            setupCodecs();
            loadSource = function () {
                var audioLoader = new AudioSampleLoader();

                var songExt = 'mp3';
                if ($scope.codecs.mp3)
                    songExt = 'mp3';
                else if ($scope.codecs.ogg)
                    songExt = 'ogg';
                else if ($scope.codecs.wav)
                    songExt = 'wav';
                audioLoader.src = "assets/sounds/kick." + songExt;
                audioLoader.ctx = audioContext;
                audioLoader.onload = function () {
                    metronomeBufferSource = audioLoader.response;
                };
                audioLoader.onerror = function () {
                    console.log("Error loading Metronome Audio");
                };
                audioLoader.send();
            };
            loadSource();
        }


        $scope.$watch('options.sound.isRhythmer', function (newVal) {
            $scope.updateSound();
        }, true);

        $scope.$watch('options.sound.bpm', function (bpmNew) {
            $scope.rate = 60000 / bpmNew;
            $scope.updateSound();
        }, true);

        $scope.$watch('cards', function () {
            $scope.updateSound();
        }, true);

        $scope.$watch('beats_on', function (newVal) {
            soundService.updateBeatsOn(newVal);
        }, true);


        $scope.$on('toggleSound', function () {
            $scope.toggleSound();
        });

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                if($rootScope.metronomeSource)
                    $scope.stopSound();
            });

    };

    $scope.updateSound = function () {
        if ($scope.beats_on) {
            $scope.stopSound();
            $scope.beats_on = false;
            $scope.toggleSound();
        }
    };

    $scope.toggleSound = function () {
        if (!$scope.beats_on) {
            $scope.beats_on = true;
            if ($scope.options.sound.isRhythmer)
                $timeout(function () {
                    $scope.playBeats($scope.beats, (60000 / $scope.options.sound.bpm));
                }, 0);
            else
                $scope.playMetronome(60000 / $scope.options.sound.bpm);
        }
        else {
            $scope.beats_on = false;
            $scope.stopSound();
        }
    };

    $scope.playBeats = function (beats, rate) {
        if ($scope.beats_on) {
            if ($scope.isHTML5Audio) {
                $scope.soundLong.sprite({'beat': [0, (rate * $scope.options.bit_count), true]});
            }

            if ($scope.isWebAudio)
                playRhythm(beats, $scope.options.sound.bpm);
            else
                $scope.doTimer(beats, rate, function () {
                        $scope.playBeat();
                    },
                    function () {
                        if ($scope.isFlashAudio)
                            $scope.playBeats(beats, rate);
                    });
        }
    };

    var flashInterval = null;
    $scope.playMetronome = function (rate) {
        if ($scope.beats_on) {
            if ($scope.isWebAudio) {
                playWebAudioMetronome($scope.beats, $scope.options.sound.bpm);
            } else {
                if ($scope.isHTML5Audio) {
                    $scope.soundLong.sprite({'beat': [0, rate, true]});
                    $scope.playBeat();
                }

                if ($scope.isFlashAudio) {
                    flashInterval = window.setInterval(function () {
                        $scope.playBeat();
                    }, rate);
                }

            }
        }
    };

    $scope.playBeat = function () {
        if ($scope.beats_on) {
            if ($scope.isHTML5Audio)
                $scope.soundLong.play('beat', function (soundId) {
                    $scope.addSound(soundId);
                });
            if ($scope.isFlashAudio) {
                Fifer.play('beat');
            }

        }
    };

    $scope.stopSound = function () {
        if ($scope.isHTML5Audio) {
            for (key in $scope.playingIDs) {
                $scope.soundLong.stop($scope.playingIDs[key]);
            }
            $scope.playingIDs = [];
        }

        if ($scope.isFlashAudio) {
            window.clearInterval(flashInterval);
            Fifer.stop('beat');
        }


        if ($scope.isWebAudio) {
            $rootScope.metronomeSource.stop ? $rootScope.metronomeSource.stop(0) : $rootScope.metronomeSource.noteOff(0);
            //$rootScope.metronomeSource.stop(0);
            $rootScope.metronomeSource.disconnect();
            $rootScope.metronomeSource = null;
        }

    };

    $scope.addSound = function (id) {
        $scope.playingIDs.push(id);
    }

    $scope.doTimer = function (beats, rate, oninstance, oncomplete) {
        var steps = beats.length,
            speed = 0,
            count = -1,
            delay = 0,
            start = new Date().getTime();

        function instance() {
            if (count++ == steps) {
                oncomplete(steps, count);
            }
            else {
                if (beats[count] == 1)
                    oninstance(steps, count);

                if (count % 2 == 0) {
                    speed = rate / 3;
                    delay = ((count / 2) * rate);
                }
                else {
                    speed = 2 * rate / 3;
                    delay = ((((count - 1) / 2) + (1 / 3)) * rate);
                }
                var diff = (new Date().getTime() - start) - delay;
                window.setTimeout(instance, (speed - diff));
            }
        }

        instance();
    };

    playRhythm = function (beats, bpm) {
        var rate = 60 / bpm;
        var noteRate = rate / 3;

        var soundBuffer = createEmptyBuffer(0.0001);
        var emptyBuffer = createEmptyBuffer(noteRate);
        var emptyDoubleBuffer = createEmptyBuffer(2 * noteRate);
        metronomeBuffer = mergeWithSilenceBuffer(metronomeBufferSource, noteRate);
        metronomeDoubleBuffer = mergeWithSilenceBuffer(metronomeBufferSource, 2 * noteRate);

        for (var i = 0; i < beats.length; i++) {
            if (beats[i] == 1) {
                if (i % 2 == 0) {
                    soundBuffer = appendBuffer(soundBuffer, metronomeBuffer);
                }
                else {
                    soundBuffer = appendBuffer(soundBuffer, metronomeDoubleBuffer);
                }
            } else {
                if (i % 2 == 0) {
                    soundBuffer = appendBuffer(soundBuffer, emptyBuffer);
                }
                else {
                    soundBuffer = appendBuffer(soundBuffer, emptyDoubleBuffer);
                }
            }
        }

        $rootScope.metronomeSource = audioContext.createBufferSource();
        $rootScope.metronomeSource.connect(audioContext.destination);
        $rootScope.metronomeSource.buffer = soundBuffer;
        $rootScope.metronomeSource.loop = true;
        $rootScope.metronomeSource.start ? $rootScope.metronomeSource.start(0) : $rootScope.metronomeSource.noteOn(0);
    };
    playWebAudioMetronome = function (beats, bpm) {
        var rate = 60 / bpm;
        metronomeBuffer = mergeWithSilenceBuffer(metronomeBufferSource, rate);
        $rootScope.metronomeSource = audioContext.createBufferSource();
        $rootScope.metronomeSource.connect(audioContext.destination);
        $rootScope.metronomeSource.buffer = metronomeBuffer;
        $rootScope.metronomeSource.loop = true;
        $rootScope.metronomeSource.start ? $rootScope.metronomeSource.start(0) : $rootScope.metronomeSource.noteOn(0);
    };

    appendBuffer = function (buffer1, buffer2) {
        var numberOfChannels = Math.min(buffer1.numberOfChannels, buffer2.numberOfChannels);
        var tmp = audioContext.createBuffer(numberOfChannels, (buffer1.length + buffer2.length), buffer1.sampleRate);
        for (var i = 0; i < numberOfChannels; i++) {
            var channel = tmp.getChannelData(i);
            channel.set(buffer1.getChannelData(i), 0);
            channel.set(buffer2.getChannelData(i), buffer1.length);
        }
        return tmp;
    };

    mergeWithSilenceBuffer = function (buffer1, length) {//buffer1 - sound, length - silence
        var frameCount = audioContext.sampleRate * length;
        var tmp = audioContext.createBuffer(buffer1.numberOfChannels, frameCount, audioContext.sampleRate);
        var numberOfChannels = buffer1.numberOfChannels;
        for (var i = 0; i < numberOfChannels; i++) {
            var channel1 = buffer1.getChannelData(i);
            var channel2 = tmp.getChannelData(i);
            arr_length = Math.min(channel1.length, channel2.length);
            for (var j = 0; j < arr_length; j++)
                channel2[j] = channel1[j];
            //channel2.set(buffer1.getChannelData(i)); //Error: invalid array length
        }
        return tmp;
    };

    createEmptyBuffer = function (rate) {
        var frameCount = audioContext.sampleRate * rate;
        var emptyBuffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate);
        return emptyBuffer;
    };


});

app.controller('aboutController', function ($scope, $rootScope, $stateParams, $translate, $location, $sce) {
    a = "<a href='mailto:";
    b = "fwg";
    c = "it4t.ru";
    d = "' class='email'>";
    e = "</a>";
    $scope.ml = $sce.trustAsHtml(a + b + "@" + c + d + b + "@" + c + e);
});

app.controller('rootCtrl', function ($scope, $rootScope, $stateParams, $translate, $location) {
    $translate(['META_DESCRIPTION', 'TITLE']).then(function (translations) {
        $rootScope.description = translations.META_DESCRIPTION;
        $rootScope.title = translations['TITLE'];
    });
});

app.controller('ContactFormCtrl', function ($scope, $http, $timeout, $rootScope, $stateParams, $translate, $location) {

    $scope.submit = function () {

        $scope.contact.ajax = 1;
        $http({
            method: 'POST',
            url: 'feedback.php', // replace with your's
            data: JSON.stringify($scope.contact),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (data) {

                if (!data.success) {
                    $scope.errorName = data.errors.name;
                    $scope.errorEmail = data.errors.email;
                    $scope.errorMessage = data.errors.message;
                    $scope.errorFrom = true;
                    $scope.successFrom = false;
                    $timeout(function () {
                        $scope.errorFrom = false;
                    }, 3000);
                    $scope.ContactForm.$dirty = false;
                    $scope.ContactForm.submitted = true;
                } else {
                    $scope.errorFrom = false;
                    $scope.successFrom = true;
                    $timeout(function () {
                        $scope.successFrom = false;
                    }, 3000);
                    $scope.contact = {};
                    $scope.ContactForm.submitted = false;
                    $scope.ContactForm.$setPristine();
                }
            })
            .error(function (data) {
                $scope.errorForm = true;
                $timeout(function () {
                    $scope.errorFrom = false;
                }, 3000);
                $scope.ContactForm.$dirty = false;
                $scope.ContactForm.submitted = true;
            });
    }
});

app.factory('soundService', function ($rootScope) {
    var service = {};
    service.beats_on = false;

    service.toggleSound = function () {
        $rootScope.$broadcast("toggleSound");
    };
    service.updateBeatsOn = function (value) {
        service.beats_on = value;
        $rootScope.$broadcast("updateBeatsOn");
    };

    return service;
});

app.factory('commonService', function ($rootScope, $translatePartialLoader,$translate, $interval, cfpLoadingBar) {
    var service = {};

    service.loadTranslate = function (part) {
        $translatePartialLoader.addPart(part);
        $translate.refresh($rootScope.activeLang);
        stop = $interval(
            function () {
                if ($translatePartialLoader.isPartLoaded(part, $rootScope.activeLang)) {
                    cfpLoadingBar.complete();
                    $rootScope.loadComplete = true;
                    $interval.cancel(stop);
                }else
                    $translate.refresh($rootScope.activeLang);
            }, 200);
    };

    return service;
});
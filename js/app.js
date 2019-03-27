var app = angular.module('dsaApp', ['ngRoute', 'angular-carousel'], function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q) {
        return {
            "responseError": function (rejection) {
                location.reload(true);
                return $q.reject(rejection);
            }
        };
    });
});

angular.module('dsaApp').config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
});

app.config(function ($routeProvider) {
    if (resourceUrl === "{!$Resource.SF1_DSA}") {
        resourceUrl = "";
    }
    $routeProvider
		.when("/", {
		    templateUrl: resourceUrl + "/partials/home.html",
		    controller: "homeController"
		})
		.when("/macs", {
		    templateUrl: resourceUrl + "/partials/mac.html",
		    controller: "macController"
		})
		.when("/hubs/:hubId", {
		    templateUrl: resourceUrl + "/partials/hub-detail.html",
		    controller: "hubController"
		})
		.when("/category/:categoryId", {
		    templateUrl: resourceUrl + "/partials/category-detail.html",
		    controller: "categoryController"
		})
		.when("/content/:contentId", {
		    templateUrl: resourceUrl + "/partials/content-detail.html",
		    controller: "contentController"
		})
		.when("/searchResults/:searchTerm", {
		    templateUrl: resourceUrl + "/partials/searchResults.html",
		    controller: "searchResultsController"
		})
		.when("/playlist/:playlistId", {
		    templateUrl: resourceUrl + "/partials/playlist-detail.html",
		    controller: "playlistController"
		})
		.when("/hubList/:letter", {
		    templateUrl: resourceUrl + "/partials/hub-list.html",
		    controller: "hubListController"
		})
		.when("/categoryList/:letter", {
		    templateUrl: resourceUrl + "/partials/category-list.html",
		    controller: "categoryListController"
		})
		.when("/hubList", {
		    templateUrl: resourceUrl + "/partials/hub-list.html",
		    controller: "hubListController"
		})
		.when("/categoryList", {
		    templateUrl: resourceUrl + "/partials/category-list.html",
		    controller: "categoryListController"
		})
		.when("/playlistList", {
		    templateUrl: resourceUrl + "/partials/playlist-list.html",
		    controller: "playlistListController"
		})
		.when("/playlistList/:category", {
		    templateUrl: resourceUrl + "/partials/playlist-list.html",
		    controller: "playlistListController"
		})
		.when("/contentList", {
		    templateUrl: resourceUrl + "/partials/content-list.html",
		    controller: "contentListController"
		})
		.when("/contentList/:category", {
		    templateUrl: resourceUrl + "/partials/content-list.html",
		    controller: "contentListController"
		})
		.when("/myContent", {
		    templateUrl: resourceUrl + "/partials/my-content.html",
		    controller: "myContentController"
		})
		.when("/error/:message", {
		    templateUrl: resourceUrl + "/partials/error.html",
		    controller: "errorController"
		});

});
var app = angular.module("dsaApp");

app.controller("appController", ["$scope", "$window", "$location", "remotingService", function ($scope, $window, $location, remotingService) {
    $scope.internalOnlyMode = false;
    $scope.info = {};
    $scope.loadingTemplate = resourceUrl + '/partials/loading.html';
    $scope.appName = 'DSA';
    $scope.appIconUrl = resourceUrl + '/images/Icon-72.png';
    $scope.homeIconUrl = resourceUrl + '/icons/standard/home.png';
    $scope.menuIconUrl = resourceUrl + '/icons/standard/menu_icon2.png';
    $scope.trendIconUrl = resourceUrl + '/icons/standard/trending_icon.png';
    $scope.followIconUrl = resourceUrl + '/icons/standard/I_follow_icon.png';
    $scope.myPlaylistIconUrl = resourceUrl + '/icons/standard/Playlist3.png';
    $scope.myFavoriteIconUrl = resourceUrl + '/icons/standard/favorites_icon.png';
    $scope.contentIcon = resourceUrl + '/icons/standard/document_blank.png';

    $scope.init = function () {
        remotingService.execute(
			"DSARemoterInfoExtension.getInfo",
			{
			    success: function (result) {
			        $scope.setupApp(result);
			    }
			},
			$scope
		);
    };

    $scope.setupApp = function (result) {
        $scope.info = result;
        if ($scope.info.currentMACTitle) {
            $scope.appName = $scope.info.currentMACTitle;
        }
        $scope.info.contentUserErrorMessage = "You are currently not a Salesforce CRM Content User. Please log a ticket for further assistance.";
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
        $scope.$broadcast("infoUpdate", $scope.info);
    };

    $scope.$on("infoUpdate-emit", function (event, info, macName) {
        $scope.setupApp(info);
        if (macName) {
            $scope.appName = macName;
        }
    });

    $scope.$on("refreshPage", function () {
        $scope.$broadcast("refreshPage-broadcast");
    });

    $scope.$on("expandHubList", function () {
        $scope.$broadcast("expandHubList2");
    });

    $scope.$on("closeHubList", function (event, closeNavBar) {
        $scope.$broadcast("closeHubList2", closeNavBar);
    });

    $scope.$on("expandPlaylistList", function (event, category) {
        $scope.$broadcast("expandPlaylistList2", category);
    });

    $scope.$on("closePlaylistList", function (event, closeNavBar) {
        $scope.$broadcast("closePlaylistList2", closeNavBar);
    });

    $scope.$on("expandContentList", function (event, category) {
        $scope.$broadcast("expandContentList2", category);
    });

    $scope.$on("closeContentList", function (event, closeNavBar) {
        $scope.$broadcast("closeContentList2", closeNavBar);
    });

    $scope.$on("internalOnlyMode", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.$broadcast("internalOnlyMode-broadcast", $scope.internalOnlyMode);
    });

    $scope.$on("searchCompleted", function () {
        $scope.$broadcast("searchCompleted-broadcast");
    });

    $scope.startLoading = function () {
        $("#loadingWrapper").show();
    };

    $scope.stopLoading = function () {
        $("#loadingWrapper").hide();
    }

    $scope.openPreferences = function () {
        if ($scope.mobile) {
            $(".preference-menu-container").show().animate({
                bottom: 0
            });
        } else if ($scope.desktop) {
            var menu = $(".preference-menu-container");
            if (menu.css("display") == "block") {
                menu.fadeOut();
            } else {
                menu.fadeIn();
            }
        }
    };

    $scope.closePreferences = function () {
        if ($scope.mobile) {
            $(".preference-menu-container").animate({
                bottom: -1000
            }, function () {
                $(this).removeAttr("style");
            });
        } else if ($scope.desktop) {
            $(".preference-menu-container").fadeOut();
        }
    };

    $scope.determineDevice = function () {
        // if (window.frameElement) {
        // 	$scope.screenWidth = +window.frameElement.attributes.width.value.replace("px","");
        // } else {
        $scope.screenWidth = $window.innerWidth;
        // }
        $scope.desktop = $scope.screenWidth >= 768;
        $scope.mobile = $scope.screenWidth < 768;
        $scope.screenHeight = $window.innerHeight;

        //this jQuery must be here so that the SF1 mobile layout doesn't change to desktop
        //$("body").css("width", $scope.screenWidth);
    };

    // $scope.onresize = $window.parent.onresize;
    // $window.parent.onresize = function() {
    // 	if (window.frameElement) {
    // 		window.frameElement.attributes.width.value = window.parent.innerWidth + "px";
    // 		window.frameElement.attributes.scrolling.value = "no";
    // 	}
    // 	if ($scope.onresize) {
    // 		$scope.onresize();
    // 	}
    // 	$scope.determineDevice();
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };

    // $window.parent.onresize();

    $scope.onresize = $window.onresize;
    $window.onresize = function () {
        if ($scope.onresize) {
            $scope.onresize();
        }
        $scope.determineDevice();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $window.onresize();

    $scope.init();
}]);
var app = angular.module("dsaApp");

app.controller("categoryController", ["$scope", "$routeParams", "$window", "$location", "remotingService", "sessionService", function ($scope, $routeParams, $window, $location, remotingService, sessionService) {
    $scope.imageHeight = 0;
    $scope.imageWidth = 0;
    $scope.imageRowWidth = 0;
    $scope.categoryImageWidth = 0;
    $scope.categoryImageHeight = 0;
    $scope.category = {};
    $scope.carouselItems = [];
    $scope.displayContentClose = false;
    $scope.chatterEnabled = false;
    $scope.relatedCategories = [];
    $scope.init = function () {
        $scope.startLoading();
        console.log($scope.info);
        if ($scope.info && $scope.info.user) {
            $scope.chatterEnabled = $scope.info.isChatterEnabled;
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
            $scope.carouselItems = [];
            remotingService.execute(
				"DSARemoterCategoryExtension.getCategoryDetailWithMAC",
				$routeParams.categoryId,
				$scope.info.preferredMobileAppConfiguration,
				{
				    success: function (result) {
				        $scope.stopLoading();
				        this.category = result;
				        if (this.category.contentItems) {
				            if (this.desktop) {
				                this.determineDesktopImageWidth();
				            }
				            this.category.isCategory = true;
				            this.carouselItems.push(this.category);
				        }
				    },
				    error: function (error) {
				        $scope.stopLoading();
				        sessionService.checkSession(error.message);
				    }
				},
				$scope
			);
            remotingService.execute(
				"DSARemoterCategoryExtension.getSubCategoriesWithMAC",
				$routeParams.categoryId,
				$scope.info.preferredMobileAppConfiguration,
				{
				    success: function (result) {
				        $scope.relatedCategories = result;
				    },
				    error: function (error) {
				        $scope.stopLoading();
				        sessionService.checkSession(error.message);
				    }
				},
				$scope
			);
        } else {
            console.log('Else');
            remotingService.execute(
				"DSARemoterInfoExtension.getInfo",
				{
				    success: function (result) {
				        $scope.setupApp(result);
				        console.log('result:');
				        console.log(result);
				    }
				},
				$scope
			);
        };


    };
    $scope.init();

    $scope.setupApp = function (result) {
        $scope.info = result;
        console.log('info:');
        console.log($scope.info);
        if ($scope.info.currentMACTitle) {
            $scope.appName = $scope.info.currentMACTitle;
        }
        $scope.info.contentUserErrorMessage = "You are currently not a Salesforce CRM Content User. Please log a ticket for further assistance.";
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
        $scope.$broadcast("infoUpdate", $scope.info);

        $scope.carouselItems = [];
        remotingService.execute(
			"DSARemoterCategoryExtension.getCategoryDetailWithMAC",
			$routeParams.categoryId,
			$scope.info.preferredMobileAppConfiguration,
			{
			    success: function (result) {
			        $scope.stopLoading();
			        this.category = result;
			        if (this.category.contentItems) {
			            if (this.desktop) {
			                this.determineDesktopImageWidth();
			            }
			            this.category.isCategory = true;
			            this.carouselItems.push(this.category);
			        }
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
        remotingService.execute(
			"DSARemoterCategoryExtension.getSubCategoriesWithMAC",
			$routeParams.categoryId,
			$scope.info.preferredMobileAppConfiguration,
			{
			    success: function (result) {
			        $scope.relatedCategories = result;
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.fixInvalidImage = function (contentItem, isMobile) {
        if (isMobile) {
            contentItem.smallImageUrl = '';
        } else {
            contentItem.largeImageUrl = '';
        }
        $window.onresize();
    };

    $scope.isValidImageUrl = function (contentItem, isMobile) {
        var img = new Image();
        img.onerror = function () { $scope.fixInvalidImage(contentItem, isMobile); };
        if (isMobile) {
            img.src = contentItem.smallImageUrl;
        } else {
            img.src = contentItem.largeImageUrl;
        }
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        $scope.chatterEnabled = $scope.info.isChatterEnabled;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.determineDevice = function () {
        $scope.categoryScreenHeight = $window.innerHeight;
        $scope.categoryScreenWidth = $window.innerWidth;
        if ($scope.desktop) {
            $scope.determineDesktopImageWidth();
        } else if ($scope.mobile) {
            $scope.imageWidth = $scope.categoryScreenWidth;
            $scope.imageHeight = Math.floor(200 * $scope.imageWidth / 280);
        }
        $scope.determineContentWidth();
        $scope.determineRelatedCategoryWidth();
    };

    $scope.determineDesktopImageWidth = function () {
        $scope.categoryImageWidth = $scope.categoryScreenWidth - 21;
        $scope.categoryImageHeight = Math.floor(260 * Math.floor(($scope.categoryScreenWidth - 21) / 3) / 280);
        $scope.imageRowWidth = $scope.categoryImageWidth + 3;
    };

    $scope.determineContentWidth = function () {
        $scope.contentWidth = $scope.desktop ? Math.floor(($scope.categoryScreenWidth - 21 - (20 * 6)) / 3) + "px" : "auto";
    };

    $scope.determineRelatedCategoryWidth = function () {
        $scope.relatedCategoryWidth = Math.floor(($scope.categoryScreenWidth - 21 - (20 * 6)) / 5);
        $scope.relatedCategoryHeight = Math.floor(200 * $scope.relatedCategoryWidth / 280);
    };

    $scope.expandContents = function () {
        if ($scope.mobile) {
            if (!$scope.displayContentClose) {
                $scope.displayContentClose = true;
                $scope.contentsTop = $("#contents").position().top;
                $("#contents").css({
                    "position": "fixed",
                    backgroundColor: "#1e2021",
                    width: "100%",
                    height: $window.innerHeight + "px",
                    "z-index": "100000",
                    top: $scope.contentsTop
                });
                $("#contents .section-header").css({
                    marginBottom: "20px"
                })
                $("#contents .section-list").show();
                $("#contents").animate({
                    top: 0
                });
            } else {
                $scope.collapseContents();
            }
        }
    };

    $scope.goToContent = function () {
        $location.url("/content/" + this.content.recordId + "?categoryId=" + $routeParams.categoryId);
    };

    $scope.expandContentItems = function (event) {
        if ($scope.mobile) {
            this.content.itemsExpanded = this.content.itemsExpanded === true ? false : true;
            $(event.target).parent().next(".section-list-items").slideToggle();
        } else if ($scope.desktop) {
            $location.url("/content/" + this.content.recordId);
        }
    };

    $scope.collapseContents = function () {
        $scope.displayContentClose = false;
        $("#contents").animate({
            top: $scope.contentsTop
        }, function () {
            $(this).removeAttr("style");
            $("#contents .section-list").hide();
            $("#contents .section-header").removeAttr("style");
        });
    };

    $scope.expandRelatedCategories = function () {
        if ($scope.mobile) {
            if (!$scope.displayRelatedCategoriesClose) {
                $scope.displayRelatedCategoriesClose = true;
                $scope.relatedCategoriesTop = $("#relatedCategories").position().top;
                $("#relatedCategories").css({
                    "position": "fixed",
                    backgroundColor: "#1e2021",
                    width: "100%",
                    height: $window.innerHeight + "px",
                    "z-index": "100000",
                    top: $scope.relatedCategoriesTop
                });
                $("#relatedCategories .section-header").css({
                    marginBottom: "20px"
                })
                $("#relatedCategories .section-list").show();
                $("#relatedCategories").animate({
                    top: 0
                });
            } else {
                $scope.collapseRelatedCategories();
            }
        }
    };

    $scope.collapseRelatedCategories = function () {
        $scope.displayRelatedCategoriesClose = false;
        $("#relatedCategories").animate({
            top: $scope.relatedCategoriesTop
        }, function () {
            $(this).removeAttr("style");
            $("#relatedCategories .section-list").hide();
            $("#relatedCategories .section-header").removeAttr("style");
        });
    };

    $scope.goToContent = function (contentItem) {
        location.href = '#/content/' + contentItem.contentDocumentId + "?categoryId=" + $routeParams.categoryId;
    };

    // $scope.onresize = $window.parent.onresize;

    // $window.parent.onresize = function() {
    // 	$scope.onresize();
    // 	$scope.determineDevice();
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;

    $window.onresize = function () {
        $scope.onresize();
        $scope.desktop = $window.innerWidth >= 768;
        $scope.mobile = $window.innerWidth < 768;
        $scope.determineDevice();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();
}]);
var app = angular.module("dsaApp");

app.controller("categoryListController", ["$scope", "$window", "$location", "remotingService", "sessionService", function ($scope, $window, $location, remotingService, sessionService) {
    $scope.alphaLists = [
		{ letter: "#", sublist: [] },
		{ letter: "A", sublist: [] }, { letter: "B", sublist: [] }, { letter: "C", sublist: [] }, { letter: "D", sublist: [] }, { letter: "E", sublist: [] }, { letter: "F", sublist: [] },
		{ letter: "G", sublist: [] }, { letter: "H", sublist: [] }, { letter: "I", sublist: [] }, { letter: "J", sublist: [] }, { letter: "K", sublist: [] }, { letter: "L", sublist: [] },
		{ letter: "M", sublist: [] }, { letter: "N", sublist: [] }, { letter: "O", sublist: [] }, { letter: "P", sublist: [] }, { letter: "Q", sublist: [] }, { letter: "R", sublist: [] },
		{ letter: "S", sublist: [] }, { letter: "T", sublist: [] }, { letter: "U", sublist: [] }, { letter: "V", sublist: [] }, { letter: "W", sublist: [] }, { letter: "X", sublist: [] },
		{ letter: "Y", sublist: [] }, { letter: "Z", sublist: [] }
    ];
    $scope.templates = {
        categoryList: resourceUrl + '/partials/category-list.html'
    };
    $scope.initRun = false;
    $scope.categoryLists = [];
    $scope.letter = "";
    $scope.activeLetter = false;

    $scope.init = function () {
        $scope.startLoading();
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
        }
        if (!$scope.initRun) {
            if ($scope.letter) {
                remotingService.execute(
					"DSARemoterCategoryExtension.getCategoriesForPrefix",
					$scope.letter, !$scope.internalOnlyMode,
					{
					    success: function (result) {
					        $scope.stopLoading();
					        $scope.filterResults(result);
					    },
					    error: function (error) {
					        $scope.stopLoading();
					        sessionService.checkSession(error.message);
					    }
					},
					$scope
				);
            } else {
                remotingService.execute(
					"DSARemoterCategoryExtension.getAllCategories",
					!$scope.internalOnlyMode,
					{
					    success: function (result) {
					        $scope.stopLoading();
					        $scope.filterResults(result);
					    },
					    error: function (error) {
					        $scope.stopLoading();
					        sessionService.checkSession(error.message);
					    }
					},
					$scope
				);
            }
        }
        $scope.initRun = true;
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.initRun = false;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.initRun = false;
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.filterResults = function (result) {
        _.each($scope.alphaLists, function (alphaList) {
            alphaList.display = false;
            alphaList.sublist = [];
        });
        if (result && result.length > 0) {
            result = _.sortBy(result, "name");
            var groupedResult = _.groupBy(result, function (category) {
                var letterKey = category.name.charAt(0);
                if (letterKey.toLowerCase() == letterKey.toUpperCase()) {
                    letterKey = '#';
                } else {
                    letterKey = letterKey.toUpperCase();
                }
                return letterKey;
            });
            _.each(_.keys(groupedResult), function (key) {
                var labelKey = key;
                var alphaLists = _.where($scope.alphaLists, { letter: labelKey });
                alphaLists[0].sublist = alphaLists[0].sublist.concat(groupedResult[key]);
            });
            $scope.categoryLists = $scope.alphaLists;
        }
    };

    $scope.filterResultsByLetter = function (letter) {
        if (letter === 'ALL') {
            $scope.letter = "";
            $scope.activeLetter = false;
        } else {
            $scope.letter = letter;
            $scope.activeLetter = true;
        }
        $scope.initRun = false;
        $scope.init();
    };

    $scope.goToAnchor = function (letter) {
        if ($scope.activeLetter) {
            $('#category-list-wrapper #page-content').scrollTop(0);
            $('#category-list-wrapper #page-content').scrollTop($("#" + letter).offset().top);
        }
    };

    $scope.goToCategory = function (recordId) {
        $location.url('/category/' + recordId);
        if ($scope.mobile) {
            $scope.collapseCategoryList(false);
        }
    };

    $scope.$on("expandCategoryList2", function () {
        $scope.displayCategoryListClose = true;
        $scope.init();
    });

    $scope.collapseCategoryList = function (closeNavBar) {
        $scope.displayCategoryListClose = false;
        $scope.$emit("closeCategoryList", closeNavBar);
    };

    $scope.$on('displayCategoryListCloseTrue', function () {
        $scope.displayCategoryListClose = true;
    });

    // $scope.onresize = $window.parent.onresize;
    // $window.parent.onresize = function() {
    // 	$scope.onresize();
    // 	$scope.categoryListScreenHeight = $window.innerHeight;
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;
    $window.onresize = function () {
        $scope.onresize();
        $scope.desktop = $window.innerWidth >= 768;
        $scope.mobile = $window.innerWidth < 768;
        $scope.categoryListScreenHeight = $window.innerHeight;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();

    if ($scope.desktop) {
        $scope.init();
    }
}]);
var app = angular.module("dsaApp");

app.controller("categoryNavbarController", ["$scope", "$location", "$routeParams", "remotingService", "sessionService", function ($scope, $location, $routeParams, remotingService, sessionService) {
    $scope.category = {};
    $scope.initialHierarchy = [];
    $scope.hierarchy = [];
    $scope.showHierarchy = false;

    $scope.init = function () {
        $scope.initialHierarchy = [];
        $scope.hierarchy = [];
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
        }
        remotingService.execute(
			"DSARemoterCategoryExtension.getCategoryWithMAC",
			$routeParams.categoryId,
			$scope.info.preferredMobileAppConfiguration,
			{
			    success: function (result) {
			        $scope.category = result;
			        if (!$scope.category.isTopLevel) {
			            $scope.getParentCategory($scope.category.categoryId);
			        }
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.getParentCategory = function (categoryId) {
        remotingService.execute(
			"DSARemoterCategoryExtension.getParentCategoryWithMAC",
			categoryId,
			$scope.info.preferredMobileAppConfiguration,
			{
			    success: function (result) {
			        $scope.initialHierarchy.push(result);
			        if (result.isTopLevel) {
			            $scope.handleHierarchy();
			        } else {
			            $scope.getParentCategory(result.categoryId);
			        }
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.handleHierarchy = function () {
        if ($scope.initialHierarchy.length > 0) {
            for (var i = $scope.initialHierarchy.length - 1; i >= 0; i--) {
                $scope.hierarchy.push($scope.initialHierarchy[i]);
            }
        }
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.slideDownHierarchy = function () {
        $("#parent-category-hierarchy-wrapper").slideDown();
        $scope.showHierarchy = true;
    };

    $scope.slideUpHierarchy = function () {
        $("#parent-category-hierarchy-wrapper").slideUp();
        $scope.showHierarchy = false;
    };

    $scope.goToCategory = function (categoryId) {
        var link = "/category/";
        if (categoryId) {
            link += categoryId;
        } else {
            link += $scope.category.categoryId;
        }
        $location.url(link);
    };

    $scope.init();
}]);
var app = angular.module("dsaApp");

app.controller("contentController", ["$scope", "$routeParams", "$window", "$location", "$sce", "remotingService", "sessionService", function ($scope, $routeParams, $window, $location, $sce, remotingService, sessionService) {
    $scope.contentItem = {};
    $scope.playlistPresent = false;
    $scope.playlistId = '';
    $scope.categoryPresent = false;
    $scope.categoryId = '';
    $scope.hasFlash = false;
    $scope.isStream = false;
    $scope.isEmbeddedVideo = false;
    $scope.videoWidth = 0;
    $scope.relatedContent = [];
    $scope.deviceList = ["desktop", "ipad", "iphone", "ipod", "androidPhone", "androidTablet", "blackberryPhone", "blackberryTablet", "windowsPhone", "windowsTablet", "fxosPhone", "fxosTablet"];
    $scope.orientationList = ["landscape", "portrait"];
    $scope.hasSourceContent = false;

    $scope.init = function () {
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
        }
        $scope.playlistId = $routeParams.playlistId;
        if ($scope.playlistId) {
            $scope.playlistPresent = true;
        }
        $scope.categoryId = $routeParams.categoryId;
        if ($scope.categoryId) {
            $scope.categoryPresent = true;
        }
        $scope.hasFlash = FlashDetect.installed;
        $scope.getContentItemDetail();
        remotingService.execute(
			"DSARemoterContentItemExtension.getRelatedContent",
			$routeParams.contentId,
			{
			    success: function (result) {
			        $scope.relatedContent = _.reject(result, function (content) {
			            return $routeParams.contentId == content.contentDocumentId;
			        });
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
        $scope.logContentReview();
    };

    $scope.fixInvalidImage = function (contentItem, isMobile) {
        if (isMobile) {
            contentItem.smallImageUrl = '';
        } else {
            contentItem.largeImageUrl = '';
        }
        $window.onresize();
    };

    $scope.isValidImageUrl = function (contentItem, isMobile) {
        var img = new Image();
        img.onerror = function () { $scope.fixInvalidImage(contentItem, isMobile); };
        if (isMobile) {
            img.src = contentItem.smallImageUrl;
        } else {
            img.src = contentItem.largeImageUrl;
        }
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.getContentItemDetail = function (skipContentGeneration) {
        $scope.startLoading();
        remotingService.execute(
			"DSARemoterContentItemExtension.getContentItemDetail",
			$routeParams.contentId,
			{
			    success: function (result) {
			        $scope.stopLoading();
			        this.contentItem = result;
			        $scope.isValidImageUrl(this.contentItem, true);
			        $scope.isValidImageUrl(this.contentItem, false);
			        if (!skipContentGeneration) {
			            if (this.contentItem.streamUUID) {
			                $scope.isStream = true;
			            } else {
			                $scope.isStream = false;
			            }
			            $scope.checkForEmbeddedVideo();
			            if ($scope.hasFlash) {
			                this.generatePreviewElement();
			            }
			            if ($scope.contentItem.sourceContentDocumentId) {
			                $scope.hasSourceContent = true;
			            }
			        }
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    },
			},
			$scope
		);
    };

    $scope.checkUrlForVideo = function (url) {
        return url.indexOf("youtube.com") != -1 || url.indexOf("vimeo.com") != -1;
    };

    $scope.checkForEmbeddedVideo = function () {
        if ($scope.contentItem.linkUrl && $scope.checkUrlForVideo($scope.contentItem.linkUrl)) {
            if ($scope.contentItem.linkUrl.indexOf("http") != -1 && $scope.contentItem.linkUrl.indexOf("https") == -1) {
                $scope.contentItem.linkUrl = $scope.contentItem.linkUrl.replace("http", "https");
            }
            if ($scope.contentItem.linkUrl.indexOf("youtube.com") != -1) {
                if ($scope.contentItem.linkUrl.indexOf("watch?v=") != -1) {
                    $scope.contentItem.linkUrl = $scope.contentItem.linkUrl.replace("watch?v=", "embed/");
                }
            } else if ($scope.contentItem.linkUrl.indexOf("vimeo.com") != -1) {
                if ($scope.contentItem.linkUrl.indexOf("player") == -1) {
                    $scope.contentItem.linkUrl = $scope.contentItem.linkUrl.replace("vimeo.com", "player.vimeo.com/video");
                }
            }
            $scope.contentItem.linkUrl = $sce.trustAsResourceUrl($scope.contentItem.linkUrl);
            $scope.isEmbeddedVideo = true;
        }
    };

    $scope.logContentReview = function () {
        var deviceName = "";
        _.each($scope.deviceList, function (deviceOption) {
            if (device[deviceOption]()) {
                deviceName = deviceOption;
            }
        });
        var orientationName = "";
        _.each($scope.orientationList, function (orientationOption) {
            if (device[orientationOption]()) {
                orientationName = orientationOption;
            }
        });
        console.log('device: ', $scope.desktop);
        remotingService.execute(
			"DSARemoterContentItemExtension.logContentReview2",
			$routeParams.contentId, $scope.desktop,
			{
			    success: function (result) {

			    }
			},
			$scope
		);
    };

    $scope.voteUp = function () {
        remotingService.execute(
			"DSARemoterContentItemExtension.thumbsUpContentItem",
			$routeParams.contentId,
			{
			    success: function () {
			        $scope.getContentItemDetail(true);
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.voteDown = function () {
        remotingService.execute(
			"DSARemoterContentItemExtension.thumbsDownContentItem",
			$routeParams.contentId,
			{
			    success: function () {
			        $scope.getContentItemDetail(true);
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.goToContent = function (contentId) {
        var link = "/content/" + contentId;
        if ($scope.categoryId) {
            link += "?categoryId=" + $scope.categoryId;
        }
        $location.url(link);
    };

    $scope.generatePreviewElement = function () {
        $("#chatterFileViewerPanel").html('<embed src="/_swf/196007/sfc/flex/DocViewer.swf" flashvars="shepherd_prefix=/sfc/servlet.shepherd&amp;v=' + $scope.contentItem.recordId + '&amp;mode=chatterfilepreview&amp;in_tests=false" width="100%" height="100%" align="middle" id="renditionLarge" quality="high" bgcolor="#f3f3f3" name="renditionLarge" allowscriptaccess="sameDomain" allowfullscreen="true" pluginspage="http://www.adobe.com/go/getflashplayer" wmode="opaque" type="application/x-shockwave-flash"><noembed>&lt;p&gt;Flash file preview&lt;/p&gt;</noembed>');
    };

    $scope.slideNewPlaylistForm = function () {
        $("#new-playlist-form").slideToggle();
    };

    $scope.openAddToPlaylist = function () {
        $scope.$broadcast("openAddToPlaylist");
    };

    $scope.closeAddToPlaylist = function () {
        $scope.$broadcast("closeAddToPlaylist");
    };

    $scope.openRemoveFromPlaylist = function () {
        $scope.$broadcast("openRemoveFromPlaylist");
    };

    $scope.closeRemoveFromPlaylist = function () {
        $scope.$broadcast("closeRemoveFromPlaylist");
    };

    $scope.openActions = function () {
        if ($scope.mobile) {
            $("#contentActionShare-menu").show().animate({
                bottom: 0
            }, function () {
                if ($scope.isStream) {
                    $(".contentThumbnail iframe").height(0);
                }
            });
        } else if ($scope.desktop) {
            $("#contentActionShare-menu").fadeIn();
        }
    };

    $scope.closeActions = function () {
        if ($scope.mobile) {
            if ($scope.isStream) {
                $(".contentThumbnail iframe").removeAttr("style");
            }
            $("#contentActionShare-menu").animate({
                bottom: -1000
            }, function () {
                $(this).removeAttr("style");
            });
        } else if ($scope.desktop) {
            $("#contentActionShare-menu").fadeOut();
        }
    };

    $scope.$on("closeActions", function () {
        $scope.closeActions();
    });

    $scope.downloadContent = function () {
        if (window.sforce && window.sforce.one) {
            window.sforce.one.navigateToSObject($scope.contentItem.contentDocumentId);
        } else {
            window.location = $scope.contentItem.downloadURL;
        }
    };

    $scope.goToSource = function () {
        $location.url("/content/" + $scope.contentItem.sourceContentDocumentId);
    };

    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.playVideo = function () {
        $("#myModal").css({
            "display": "block"
        });
        $scope.$emit("closeActions");
    }

    $scope.pauseVideo = function () {
        var vid = document.getElementById("video-modal");
        vid.pause();
        console.log('the video is paused');
    }

    $scope.openContent = function () {
        if ($scope.contentItem.fileType == 'LINK' && $scope.contentItem.linkUrl) {
            window.open($scope.contentItem.linkUrl);
        } else if (window.sforce && window.sforce.one) {
            window.sforce.one.navigateToSObject($scope.contentItem.contentDocumentId);
        } else {
            window.open('/' + $scope.contentItem.contentDocumentId);
        }
    };

    // $scope.onresize = $window.parent.onresize;

    // $window.parent.onresize = function() {
    // 	$scope.onresize();
    // 	$scope.contentScreenHeight = $window.innerHeight;
    // 	var windowWidth = 0;
    // 	if (window.frameElement) {
    // 		windowWidth = +window.frameElement.attributes.width.value.replace("px","");
    // 	} else {
    // 		windowWidth = $window.innerWidth;
    // 	}
    // 	$scope.videoWidth = $scope.desktop ? Math.floor(windowWidth * .50) : windowWidth;
    // 	$scope.videoHeight = $scope.desktop ? 350 : 175;
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;

    $window.onresize = function () {
        $scope.onresize();
        $scope.desktop = $window.innerWidth >= 768;
        $scope.mobile = $window.innerWidth < 768;
        $scope.contentScreenHeight = $window.innerHeight || Math.max(document.documentElement.clientHeight, document.body.clientHeight);
        var windowWidth = 0;
        // if (window.frameElement) {
        // 	windowWidth = +window.frameElement.attributes.width.value.replace("px","");
        // } else {
        windowWidth = $window.innerWidth;
        // }
        $scope.videoWidth = $scope.desktop ? Math.floor(windowWidth * .50) : windowWidth;
        $scope.videoHeight = $scope.desktop ? 350 : 175;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();
    $scope.init();
}]);
var app = angular.module("dsaApp");

app.controller("contentListController", ["$scope", "$window", "$location", "$routeParams", "remotingService", "sessionService", function ($scope, $window, $location, $routeParams, remotingService, sessionService) {
    $scope.alphaLists = [
		{ letter: "#", sublist: [], display: false },
		{ letter: "A", sublist: [], display: false }, { letter: "B", sublist: [], display: false }, { letter: "C", sublist: [], display: false }, { letter: "D", sublist: [], display: false }, { letter: "E", sublist: [], display: false }, { letter: "F", sublist: [], display: false },
		{ letter: "G", sublist: [], display: false }, { letter: "H", sublist: [], display: false }, { letter: "I", sublist: [], display: false }, { letter: "J", sublist: [], display: false }, { letter: "K", sublist: [], display: false }, { letter: "L", sublist: [], display: false },
		{ letter: "M", sublist: [], display: false }, { letter: "N", sublist: [], display: false }, { letter: "O", sublist: [], display: false }, { letter: "P", sublist: [], display: false }, { letter: "Q", sublist: [], display: false }, { letter: "R", sublist: [], display: false },
		{ letter: "S", sublist: [], display: false }, { letter: "T", sublist: [], display: false }, { letter: "U", sublist: [], display: false }, { letter: "V", sublist: [], display: false }, { letter: "W", sublist: [], display: false }, { letter: "X", sublist: [], display: false },
		{ letter: "Y", sublist: [], display: false }, { letter: "Z", sublist: [], display: false }
    ];
    //debugger;
    $scope.templates = {
        contentList: resourceUrl + '/partials/content-list.html'
    };
    $scope.initRun = false;
    $scope.contentLists = [];
    $scope.category = $routeParams.category;
    $scope.pageNumber = 1;
    $scope.showPrevious = false;
    $scope.showNext = false;
    $scope.trendingFilter = "views";
    $scope.letter = "";
    $scope.activeLetter = false;

    $scope.init = function () {
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
        }
        if (!$scope.initRun) {
            $scope.getContents(1);
        }
        $scope.initRun = true;
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.initRun = false;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.initRun = false;
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.getContents = function (pageNumber) {
        $scope.startLoading();
        switch ($scope.category) {
            case "":
            case null:
            case undefined:
                if ($scope.letter) {
                    remotingService.execute(
						"DSARemoterContentItemExtension.getContentItemsForPrefix",
						$scope.letter,
						{
						    success: function (result) {
						        var resultObj = {
						            items: result,
						            pageNumber: 1,
						            totalPages: 1,
						            totalItems: result.length
						        }
						        $scope.handleResult(resultObj);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                } else {
                    remotingService.execute(
						"DSARemoterContentItemExtension.getContentItems",
						pageNumber,
						{
						    success: function (result) {
						        $scope.handleResult(result);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                }
                break;
            case 'recent':
                remotingService.execute(
					"DSARemoterContentItemExtension.getMostRecentContent",
					{
					    success: function (result) {
					        var resultObj = {
					            items: result,
					            pageNumber: 1,
					            totalPages: 1,
					            totalItems: result.length
					        }
					        $scope.handleResult(resultObj);
					    },
					    error: function (error) {
					        $scope.stopLoading();
					        sessionService.checkSession(error.message);
					    }
					},
					$scope
				);
                break;
            case 'featured':
                if ($scope.letter) {
                    remotingService.execute(
						"DSARemoterContentItemExtension.getFeaturedContentForPrefix",
						$scope.letter,
						{
						    success: function (result) {
						        var resultObj = {
						            items: result,
						            pageNumber: 1,
						            totalPages: 1,
						            totalItems: result.length
						        }
						        $scope.handleResult(resultObj);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                } else {
                    remotingService.execute(
						"DSARemoterContentItemExtension.getFeaturedContent",
						{
						    success: function (result) {
						        var resultObj = {
						            items: result,
						            pageNumber: 1,
						            totalPages: 1,
						            totalItems: result.length
						        }
						        $scope.handleResult(resultObj);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                }
                break;
            case 'trending':
                if ($scope.trendingFilter === "views") {
                    remotingService.execute(
						"DSARemoterContentItemExtension.getTrendingContentByViews",
						{
						    success: function (result) {
						        var resultObj = {
						            items: result,
						            pageNumber: 1,
						            totalPages: 1,
						            totalItems: result.length
						        }
						        $scope.handleResult(resultObj);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                } else if ($scope.trendingFilter === "votes") {
                    remotingService.execute(
						"DSARemoterContentItemExtension.getTrendingContentByVotes",
						{
						    success: function (result) {
						        var resultObj = {
						            items: result,
						            pageNumber: 1,
						            totalPages: 1,
						            totalItems: result.length
						        }
						        $scope.handleResult(resultObj);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                }
                break;
        }
    };

    $scope.changeTrendingFilter = function (trendingFilter) {
        $scope.trendingFilter = trendingFilter;
        $scope.goToCategory($scope.category);
    };

    $scope.handleResult = function (result) {
        $scope.stopLoading();
        $scope.pageNumber = result.pageNumber;
        $scope.showPrevious = $scope.pageNumber > 1;
        $scope.showNext = $scope.pageNumber < result.totalPages;
        if ($scope.category != 'trending' && $scope.category != 'recent') {
            $scope.filterResults(result.items, result);
        } else {
            $scope.contentLists = result.items;
        }
    };

    $scope.getPrevious = function () {
        if ($scope.showPrevious) {
            $scope.pageNumber--;
            $scope.getContents($scope.pageNumber);
        }
    };

    $scope.getNext = function () {
        if ($scope.showNext) {
            $scope.pageNumber++;
            $scope.getContents($scope.pageNumber);
        }
    };

    $scope.filterResults = function (result, resultObj) {
        //debugger;
        _.each($scope.alphaLists, function (alphaList) {
            alphaList.display = false;
            alphaList.sublist = [];
        });
        if (result && result.length > 0) {
            result = _.sortBy(result, "title");
            var groupedResult = _.groupBy(result, function (content) {
                var letterKey = content.title.charAt(0);
                if (letterKey.toLowerCase() == letterKey.toUpperCase()) {
                    letterKey = '#';
                } else {
                    letterKey = letterKey.toUpperCase();
                }
                return letterKey;
            });
            _.each(_.keys(groupedResult), function (key) {
                var labelKey = key;
                var alphaLists = _.where($scope.alphaLists, { letter: labelKey });
                //alphaLists[0].sublist = _.sortBy(alphaLists[0].sublist.concat(groupedResult[key]),"title");
                alphaLists[0].sublist = (alphaLists[0].sublist.concat(groupedResult[key])).sort(function (a, b) {
                    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                });
                alphaLists[0].display = true;
            });
            var letters = _.sortBy(_.keys(groupedResult));
            var index = 0;
            if (resultObj.totalPages == 1) {
                _.each($scope.alphaLists, function (alphaList) {
                    alphaList.display = true;
                });
            } else if (resultObj.totalPages > 1) {
                if (resultObj.pageNumber == 1) {
                    while ($scope.alphaLists[index].letter !== _.last(letters)) {
                        $scope.alphaLists[index].display = true;
                        index++;
                    }
                } else {
                    while ($scope.alphaLists[index].letter !== _.first(letters)) {
                        index++;
                    }
                    if (resultObj.pageNumber == resultObj.totalPages) {
                        while (index < $scope.alphaLists.length) {
                            $scope.alphaLists[index].display = true;
                            index++;
                        }
                    } else {
                        while ($scope.alphaLists[index].letter !== _.last(letters)) {
                            $scope.alphaLists[index].display = true;
                            index++;
                        }
                    }
                }
            }
            $scope.contentLists = $scope.alphaLists;
        }
    };

    $scope.filterResultsByLetter = function (letter) {
        if (letter === 'ALL') {
            $scope.letter = "";
            $scope.activeLetter = false;
        } else {
            $scope.letter = letter;
            $scope.activeLetter = true;
        }
        $scope.initRun = false;
        $scope.init();
    };

    $scope.goToAnchor = function (letter) {
        //if ($("#" + letter + ".active-letter").length) {
        if ($scope.activeLetter) {
            $('#content-list-wrapper #page-content').scrollTop(0);
            $('#content-list-wrapper #page-content').scrollTop($("#" + letter).offset().top);
        }
    };

    $scope.goToContent = function (recordId) {
        $location.url('/content/' + recordId);
        if ($scope.mobile) {
            $scope.collapseContentList(true);
        }
    };

    $scope.goToCategory = function (category) {
        $scope.pageNumber = 1;
        $scope.letter = "";
        if ($scope.mobile) {
            $scope.category = category;
            $scope.getContents($scope.pageNumber);
        } else {
            if (category == $scope.category) {
                $scope.getContents($scope.pageNumber);
            } else {
                $location.url('/contentList/' + category);
            }
        }
    };

    $scope.$on("expandContentList2", function (event, category) {
        $scope.displayContentListClose = true;
        $scope.goToCategory(category);
    });

    $scope.collapseContentList = function (closeNavBar) {
        $scope.displayContentListClose = false;
        $scope.$emit("closeContentList", closeNavBar);
    };

    $scope.$on('displayContentListCloseTrue', function () {
        $scope.displayContentListClose = true;
    });

    // $scope.onresize = $window.parent.onresize;
    // $window.parent.onresize = function() {
    // 	$scope.onresize();
    // 	$scope.contentListScreenHeight = $window.innerHeight;
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;
    $window.onresize = function () {
        $scope.onresize();
        $scope.desktop = $window.innerWidth >= 768;
        $scope.mobile = $window.innerWidth < 768;
        $scope.contentListScreenHeight = $window.innerHeight;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();

    if ($scope.desktop) {
        $scope.init();
    }
}]);
var app = angular.module("dsaApp");

app.controller("myContentController", ["$scope", "remotingService", "$location", "$sce", function ($scope, remotingService, $location, $sce) {
    $scope.mycontentLists = [];
    $scope.jsonStringLists = [];
    $scope.existingContent = [];

    $scope.init = function () {
        $scope.getMyContent();
    }

    $scope.goToContent = function (id) {
        $location.url("/content/" + id);
    }

    $scope.getMyContent = function (ev) {
        $scope.startLoading();
        remotingService.execute(
			"DSARemoterContentItemExtension.getMyContentItems", {
			    success: function (result) {
			        $scope.stopLoading();
			        $scope.existingContent = result;
			    },
			    error: function (error) {
			        console.log(error.message);
			    }
			},
			$scope
		);
    }
    $scope.handleChange = function (ev) {
        if (ev.target.files) {
            for (var i = 0; i < ev.target.files.length; i++) {
                var file = ev.target.files[i];
                $scope.mycontentLists.push(file);
            };
            $scope.$apply();
        }
    }
    $scope.handleDrop = function (ev) {
        if (ev.dataTransfer.items) {
            for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                if (ev.dataTransfer.items[i].kind === 'file') {
                    var file = ev.dataTransfer.items[i].getAsFile();
                    $scope.mycontentLists.push(file);
                };
            };
            $scope.$apply();
        }
    }
    $scope.removeContentItem = function (index) {
        if (index > -1) {
            $scope.mycontentLists.splice(index, 1);
        }
    }
    $scope.uploadContentItem = function (index) {
        var uploadItem = [];
        var file = $scope.mycontentLists[index];
        if (file) {
            $scope.base64Encode(file, function (dataurl) {
                uploadItem.push(JSON.stringify(dataurl));
            });
            $scope.startLoading();
            remotingService.execute(
				"DSARemoterContentItemExtension.saveAllContentItems2", uploadItem, {
				    success: function (result) {
				        $scope.getMyContent();
				        $scope.mycontentLists.splice(index, 1);
				        $scope.jsonStringLists = [];
				    },
				    error: function (error) {
				        console.log(error.message);
				        $scope.stopLoading();
				    }
				},
				$scope
			);
        }

    }
    $scope.emailContentItem = function (Id) {
        if (Id) {
            remotingService.execute(
				"DSARemoterContentItemExtension.getContentItemDetail", Id, {
				    success: function (result) {
				        $scope.stopLoading();
				        var downloadURL = result.downloadURL;
				        var doc = $sce.trustAsResourceUrl(downloadURL);
				        window.location.href = "mailto:?subject=Content%20From%20Mastercard&body=Content:%0D%0A" + doc;
				    },
				    error: function (error) {
				        $scope.stopLoading();
				        console.log(error);
				    },
				},
				$scope
			);
        }
    }
    $scope.deleteContentItem = function (Id, Name) {
        var deleteThis = confirm("Are you sure you want to delete this file from Salesforce?: \n" + Name);
        if (deleteThis == true) {
            $scope.startLoading();
            remotingService.execute(
				"DSARemoterContentItemExtension.deleteContent", Id, {
				    success: function (result) {
				        $scope.getMyContent();
				    },
				    error: function (error) {
				        $scope.stopLoading();
				        console.log(error.message);
				    }
				},
				$scope
			);
        } else {
            console.log('Cancelled');
        }

    }
    $scope.uploadAll = function () {
        $scope.startLoading();
        if ($scope.mycontentLists.length > 0) {
            for (var i = 0; i < $scope.mycontentLists.length; i++) {
                $scope.base64Encode($scope.mycontentLists[i], function (dataurl) {
                    $scope.jsonStringLists.push(JSON.stringify(dataurl));
                }
				);
            }

            remotingService.execute(
				"DSARemoterContentItemExtension.saveAllContentItems2", $scope.jsonStringLists, {
				    success: function (result) {
				        $scope.getMyContent();
				        $scope.mycontentLists = [];
				        $scope.jsonStringLists = [];
				    },
				    error: function (error) {
				        console.log(error.message);
				        $scope.stopLoading();
				    }
				},
				$scope
			);
        }
    }
    $scope.base64Encode = function (file, onProcessedCallback) {
        var dataurl = '';
        var fileBase64 = '';
        var reader = new FileReader();
        reader.onload = function () {
            var readerResult = reader.result;
            fileBase64 = readerResult.split(",").pop();

            const data = {
                'file': fileBase64,
                'filename': file.name
            };
            onProcessedCallback(data);
        }
        reader.readAsDataURL(file);

        return dataurl;
    }
    $scope.init();
}]);
var app = angular.module("dsaApp");

app.controller("errorController", ["$scope", "$routeParams", "$window", "$location", "remotingService", function ($scope, $routeParams, $window, $location, remotingService) {
    $scope.message = $routeParams.message;
    $scope.init = function () {

    };

    // $scope.onresize = $window.parent.onresize;

    // $window.parent.onresize = function() {
    // 	$scope.onresize();
    // 	$scope.errorScreenHeight = $window.innerHeight;
    // 	var windowWidth = 0;
    // 	if (window.frameElement) {
    // 		windowWidth = +window.frameElement.attributes.width.value.replace("px","");
    // 	} else {
    // 		windowWidth = $window.innerWidth;
    // 	}
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;

    $window.onresize = function () {
        $scope.onresize();
        $scope.desktop = $window.innerWidth >= 768;
        $scope.mobile = $window.innerWidth < 768;
        $scope.errorScreenHeight = $window.innerHeight;
        var windowWidth = 0;
        // if (window.frameElement) {
        // 	windowWidth = +window.frameElement.attributes.width.value.replace("px","");
        // } else {
        windowWidth = $window.innerWidth;
        // }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();

    $scope.init();
}]);
var app = angular.module("dsaApp");

app.controller("homeController", ["$scope", "$rootScope", "$window", "$location", "remotingService", "sessionService", function ($scope, $rootScope, $window, $location, remotingService, sessionService) {
    $scope.imageHeight = 0;
    $scope.imageWidth = 0;
    $scope.imageRowWidth = 0;
    $scope.templates = {
        categoryList: resourceUrl + '/partials/category-list.html'
    };
    $scope.homeScreenWidth = 0;
    $scope.myPlaylistIconUrl = resourceUrl + '/icons/standard/Playlist3.png';
    $scope.contentIcon = resourceUrl + '/icons/standard/document_blank.png';


    var specialSort = function (result) {
        var orderSort = [];
        var nameSort = [];
        result.forEach(function (category) {
            if (category.order) {
                orderSort.push(category);
            }
            else {
                nameSort.push(category);
            }
        });
        orderSort.sort(sort_by('order', false, parseInt));
        nameSort.sort(sort_by('name', false, function (a) { return a.toUpperCase() }));
        orderSort.push.apply(orderSort, nameSort);

        return orderSort;
    }

    var sort_by = function (field, reverse, primer) {
        var key = primer ?
	       function (x) { return primer(x[field]) } :
	       function (x) { return x[field] };

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }

    $scope.init = function () {
        $scope.startLoading();
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
            if (!$scope.info.preferredMobileAppConfiguration) {
                $location.url("/macs");
            } else {
                remotingService.execute(
					"DSARemoterCategoryExtension.getTopLevelCategories",
					$scope.info.preferredMobileAppConfiguration,
					{
					    success: function (result) {
					        result = specialSort(result);
					        result.forEach
					        $scope.stopLoading();
					        this.categories = result;
					        if (this.desktop && this.categories) {
					            this.determineDesktopImageWidth();
					        }
					    },
					    error: function (error) {
					        $scope.stopLoading();
					        sessionService.checkSession(error.message);
					    }
					},
					$scope
				);
            }
        }
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
        $scope.init();
    });

    $scope.goToAllCategories = function () {
        if ($scope.mobile) {
            $scope.$emit("expandCategoryList");
        }
    };

    $scope.goToAllPlaylists = function (category) {
        if ($scope.mobile) {
            $scope.$emit("expandPlaylistList", category);
        } else {
            $location.url("/playlistList/" + category);
        }
    };

    $scope.goToAllContents = function (category) {
        if ($scope.mobile) {
            $scope.$emit("expandContentList", category);
        } else {
            $location.url("/contentList/" + category);
        }
    };

    $scope.$on('displayCategoryListCloseFalse', function () {
        $scope.displayCategoryListClose = false;
    });

    $scope.determineDevice = function () {
        $scope.homeScreenHeight = $window.innerHeight;
        $scope.homeScreenWidth = $window.innerWidth;
        if ($scope.desktop && $scope.categories) {
            $scope.determineDesktopImageWidth();
        } else {
            $scope.imageWidth = $scope.homeScreenWidth;
            $scope.imageHeight = Math.floor(200 * $scope.imageWidth / 280);
        }
    };

    $scope.assignWidthClass = function (widthClass, remainderWidthClass) {
        if (!$scope.remainder) {
            $scope.remainder = 0;
        }
        _.each($scope.categories, function (category, index) {
            if (index < $scope.remainder && remainderWidthClass) {
                category.widthClass = remainderWidthClass;
            } else {
                category.widthClass = widthClass;
            }
        });
    };

    $scope.determineDesktopImageWidth = function () {
        $scope.imageWidth = 0;
        $scope.imageHeight = 0;
        $scope.remainderImageWidth = 0;
        $scope.remainderImageHeight = 0;
        $scope.remainder = 0;
        if ($scope.categories.length % 3 === 0) {
            $scope.imageWidth = Math.floor(($scope.homeScreenWidth - 21) / 3);
            $scope.imageRowWidth = $scope.imageWidth * 3 + 3;
            $scope.assignWidthClass("three-in-row");
        } else if ($scope.categories.length === 1 || $scope.categories.length === 2) {
            $scope.imageWidth = Math.floor(($scope.homeScreenWidth - 21) / $scope.categories.length);
            $scope.imageRowWidth = $scope.imageWidth * $scope.categories.length;
            if ($scope.categories.length === 1) {
                $scope.assignWidthClass("one-in-row");
            } else {
                $scope.assignWidthClass("two-in-row");
            }
        } else if ($scope.categories.length % 4 === 0) {
            $scope.imageWidth = Math.floor(($scope.homeScreenWidth - 21) / 4);
            $scope.imageRowWidth = $scope.imageWidth * 4 + 4;
            $scope.assignWidthClass("four-in-row");
        } else if ($scope.categories.length) {
            $scope.remainder = $scope.categories.length % 3;
            $scope.remainder = $scope.remainder == 1 ? 4 : $scope.remainder;
            $scope.remainderImageWidth = Math.floor(($scope.homeScreenWidth - 21) / $scope.remainder);
            $scope.imageWidth = Math.floor(($scope.homeScreenWidth - 21) / 3);
            $scope.imageRowWidth = $scope.imageWidth * 3 + 3;
            $scope.remainderImageHeight = Math.floor(200 * $scope.remainderImageWidth / 280);
            var remainderWidthClass = "";
            switch ($scope.remainder) {
                case 1:
                    remainderWidthClass = "one-in-row";
                    break;
                case 2:
                    remainderWidthClass = "two-in-row";
                    break;
                case 3:
                    remainderWidthClass = "three-in-row";
                    break;
                case 4:
                    remainderWidthClass = "four-in-row";
                    break;
            }
            $scope.assignWidthClass("three-in-row", remainderWidthClass);
        }
        $scope.imageHeight = Math.floor(200 * $scope.imageWidth / 280);
        if (!$scope.remainderImageWidth) {
            $scope.remainderImageWidth = $scope.imageWidth;
        }
        if (!$scope.remainderImageHeight) {
            $scope.remainderImageHeight = $scope.imageHeight;
        }
    };

    $scope.goToPlaylist = function () {
        remotingService.execute(
			"DSARemoterPlaylistExtension.getMyFavoritesPlaylist",
			{
			    success: function (result) {
			        console.log(result[0]);
			        if (result[0] !== undefined) {
			            $location.url('/playlist/' + result[0].recordId);
			            if ($scope.mobile) {
			                $scope.collapsePlaylistList(true);
			            }
			        } else {
			            alert('You must have a playlist created with the title of My Favorites.');
			        }
			    },
			    error: function (error) {
			        $scope.stopLoading;
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.goToFavoritePlaylist = function () {
        remotingService.execute(
			"DSARemoterPlaylistExtension.getMyFavoritesPlaylist",
			{
			    success: function (result) {
			        console.log(result[0]);
			        if (result[0] !== undefined) {
			            $location.url('/playlist/' + result[0].recordId);
			            if ($scope.mobile) {
			                $scope.collapsePlaylistList(true);
			            }
			        } else {
			            alert('You must have a playlist created with the title of My Favorites.');
			        }
			    },
			    error: function (error) {
			        $scope.stopLoading;
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    // $scope.onresize = $window.parent.onresize;

    // $window.parent.onresize = function() {
    // 	if (window.frameElement) {
    // 		window.frameElement.attributes.width.value = window.parent.innerWidth + "px";
    // 		window.frameElement.attributes.scrolling.value = "no";
    // 	}
    // 	$scope.onresize();
    // 	$scope.determineDevice();
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;

    $window.onresize = function () {
        $scope.onresize();
        $scope.desktop = $window.innerWidth >= 768;
        $scope.mobile = $window.innerWidth < 768;
        $scope.determineDevice();
        if ($scope.mobile) {
            $("body").css("width", $scope.homeScreenWidth);
        } else {
            $("body").removeAttr("style");
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();

    $scope.init();

}]);
var app = angular.module("dsaApp");

app.controller("hubController", ["$scope", "$routeParams", "$window", "$location", "remotingService", "sessionService", function ($scope, $routeParams, $window, $location, remotingService, sessionService) {
    $scope.imageHeight = 0;
    $scope.imageWidth = 0;
    $scope.imageRowWidth = 0;
    $scope.hubImageWidth = 0;
    $scope.hubImageHeight = 0;
    $scope.hub = {};
    $scope.carouselItems = [];
    $scope.displayPlaylistClose = false;
    $scope.chatterEnabled = false;
    $scope.init = function () {
        if ($scope.info && $scope.info.user) {
            $scope.chatterEnabled = $scope.info.isChatterEnabled;
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
        }
        $scope.carouselItems = [];
        remotingService.execute(
			"DSARemoterHubExtension.getHubDetail",
			$routeParams.hubId, !$scope.internalOnlyMode,
			{
			    success: function (result) {
			        this.hub = result;
			        if (this.hub.contentItems) {
			            if (this.desktop) {
			                this.determineDesktopImageWidth();
			            }
			            this.hub.isHub = true;
			            this.carouselItems.push(this.hub);
			            _.each(this.hub.contentItems, function (elem, index, collection) {
			                $scope.isValidImageUrl(elem, true);
			                $scope.isValidImageUrl(elem, false);
			                elem.isHub = false;
			                this.carouselItems.push(elem);
			            }, this);
			        }
			    },
			    error: function (error) {
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };
    $scope.init();

    $scope.fixInvalidImage = function (contentItem, isMobile) {
        if (isMobile) {
            contentItem.smallImageUrl = '';
        } else {
            contentItem.largeImageUrl = '';
        }
        $window.onresize();
    };

    $scope.isValidImageUrl = function (contentItem, isMobile) {
        var img = new Image();
        img.onerror = function () { $scope.fixInvalidImage(contentItem, isMobile); };
        if (isMobile) {
            img.src = contentItem.smallImageUrl;
        } else {
            img.src = contentItem.largeImageUrl;
        }
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        $scope.chatterEnabled = $scope.info.isChatterEnabled;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.determineDevice = function () {
        $scope.hubScreenHeight = $window.innerHeight;
        if ($scope.desktop) {
            $scope.determineDesktopImageWidth();
        } else if ($scope.mobile) {
            $scope.imageWidth = $scope.screenWidth;
            $scope.imageHeight = Math.floor(200 * $scope.imageWidth / 280);
        }
        $scope.determinePlaylistWidth();
        $scope.determineRelatedHubWidth();
    };

    $scope.determineDesktopImageWidth = function () {
        $scope.imageWidth = 0;
        $scope.imageHeight = 0;
        $scope.remainderImageWidth = 0;
        $scope.remainderImageHeight = 0;
        $scope.remainder = 0;
        if ($scope.hub.contentItems) {
            if ($scope.hub.contentItems.length % 3 === 0) {
                $scope.imageWidth = Math.floor(($scope.screenWidth - 21) / 3);
                $scope.imageRowWidth = $scope.imageWidth * 3 + 3;
            } else if ($scope.hub.contentItems.length === 1 || $scope.hub.contentItems.length === 2) {
                $scope.imageWidth = Math.floor(($scope.screenWidth - 21) / $scope.hub.contentItems.length);
                $scope.imageRowWidth = $scope.imageWidth * $scope.hub.contentItems.length;
            } else if ($scope.hub.contentItems.length % 4 === 0) {
                $scope.imageWidth = Math.floor(($scope.screenWidth - 21) / 4);
                $scope.imageRowWidth = $scope.imageWidth * 4 + 4;
            } else if ($scope.hub.contentItems.length) {
                $scope.remainder = $scope.hub.contentItems.length % 3;
                $scope.remainder = $scope.remainder == 1 ? 4 : $scope.remainder;
                $scope.remainderImageWidth = Math.floor(($scope.screenWidth - 21) / $scope.remainder);
                $scope.imageWidth = Math.floor(($scope.screenWidth - 21) / 3);
                $scope.imageRowWidth = $scope.imageWidth * 3 + 3;
                $scope.remainderImageHeight = Math.floor(200 * $scope.remainderImageWidth / 280);
            }
        }
        $scope.imageHeight = Math.floor(200 * $scope.imageWidth / 280);
        if (!$scope.remainderImageWidth) {
            $scope.remainderImageWidth = $scope.imageWidth;
        }
        if (!$scope.remainderImageHeight) {
            $scope.remainderImageHeight = $scope.imageHeight;
        }
        $scope.hubImageWidth = $scope.screenWidth - 21;
        $scope.hubImageHeight = Math.floor(260 * Math.floor(($scope.screenWidth - 21) / 3) / 280);
        if (!$scope.imageRowWidth) {
            $scope.imageRowWidth = $scope.hubImageWidth + 3;
        }
    };

    $scope.determinePlaylistWidth = function () {
        $scope.playListWidth = $scope.desktop ? Math.floor(($scope.screenWidth - 21 - (20 * 6)) / 3) + "px" : "auto";
    };

    $scope.determineRelatedHubWidth = function () {
        $scope.relatedHubWidth = Math.floor(($scope.screenWidth - 21 - (20 * 6)) / 5);
        $scope.relatedHubHeight = Math.floor(200 * $scope.relatedHubWidth / 280);
    };

    $scope.expandPlaylists = function () {
        if ($scope.mobile) {
            if (!$scope.displayPlaylistClose) {
                $scope.displayPlaylistClose = true;
                $scope.playlistsTop = $("#playlists").position().top;
                $("#playlists").css({
                    "position": "fixed",
                    backgroundColor: "#1e2021",
                    width: "100%",
                    height: $window.innerHeight + "px",
                    "z-index": "100000",
                    top: $scope.playlistsTop
                });
                $("#playlists .section-header").css({
                    marginBottom: "20px"
                })
                $("#playlists .section-list").show();
                $("#playlists").animate({
                    top: 0
                });
            } else {
                $scope.collapsePlaylists();
            }
        }
    };

    $scope.goToPlaylist = function () {
        $location.url("/playlist/" + this.playlist.recordId + "?hubId=" + $routeParams.hubId);
    };

    $scope.expandPlaylistItems = function (event) {
        if ($scope.mobile) {
            this.playlist.itemsExpanded = this.playlist.itemsExpanded === true ? false : true;
            $(event.target).parent().next(".section-list-items").slideToggle();
        } else if ($scope.desktop) {
            $location.url("/playlist/" + this.playlist.recordId);
        }
    };

    $scope.collapsePlaylists = function () {
        $scope.displayPlaylistClose = false;
        $("#playlists").animate({
            top: $scope.playlistsTop
        }, function () {
            $(this).removeAttr("style");
            $("#playlists .section-list").hide();
            $("#playlists .section-header").removeAttr("style");
        });
    };

    $scope.expandRelatedHubs = function () {
        if ($scope.mobile) {
            if (!$scope.displayRelatedHubsClose) {
                $scope.displayRelatedHubsClose = true;
                $scope.relatedHubsTop = $("#relatedHubs").position().top;
                $("#relatedHubs").css({
                    "position": "fixed",
                    backgroundColor: "#1e2021",
                    width: "100%",
                    height: $window.innerHeight + "px",
                    "z-index": "100000",
                    top: $scope.relatedHubsTop
                });
                $("#relatedHubs .section-header").css({
                    marginBottom: "20px"
                })
                $("#relatedHubs .section-list").show();
                $("#relatedHubs").animate({
                    top: 0
                });
            } else {
                $scope.collapseRelatedHubs();
            }
        }
    };

    $scope.collapseRelatedHubs = function () {
        $scope.displayRelatedHubsClose = false;
        $("#relatedHubs").animate({
            top: $scope.relatedHubsTop
        }, function () {
            $(this).removeAttr("style");
            $("#relatedHubs .section-list").hide();
            $("#relatedHubs .section-header").removeAttr("style");
        });
    };

    $scope.goToContent = function (contentItem) {
        location.href = '#/content/' + contentItem.contentDocumentId;
    };

    $scope.determineDevice();

    // $scope.onresize = $window.parent.onresize;

    // $window.parent.onresize = function() {
    // 	$scope.onresize();
    // 	$scope.determineDevice();
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;

    $window.onresize = function () {
        $scope.onresize();
        $scope.determineDevice();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();
}]);
var app = angular.module("dsaApp");

app.controller("hubListController", ["$scope", "$window", "$location", "remotingService", function ($scope, $window, $location, remotingService) {
    $scope.alphaLists = [
		{ letter: "#", sublist: [] },
		{ letter: "A", sublist: [] }, { letter: "B", sublist: [] }, { letter: "C", sublist: [] }, { letter: "D", sublist: [] }, { letter: "E", sublist: [] }, { letter: "F", sublist: [] },
		{ letter: "G", sublist: [] }, { letter: "H", sublist: [] }, { letter: "I", sublist: [] }, { letter: "J", sublist: [] }, { letter: "K", sublist: [] }, { letter: "L", sublist: [] },
		{ letter: "M", sublist: [] }, { letter: "N", sublist: [] }, { letter: "O", sublist: [] }, { letter: "P", sublist: [] }, { letter: "Q", sublist: [] }, { letter: "R", sublist: [] },
		{ letter: "S", sublist: [] }, { letter: "T", sublist: [] }, { letter: "U", sublist: [] }, { letter: "V", sublist: [] }, { letter: "W", sublist: [] }, { letter: "X", sublist: [] },
		{ letter: "Y", sublist: [] }, { letter: "Z", sublist: [] }
    ];
    $scope.templates = {
        hubList: resourceUrl + '/partials/hub-list.html'
    };
    $scope.initRun = false;
    $scope.hubLists = [];
    $scope.letter = "";
    $scope.activeLetter = false;

    $scope.init = function () {
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
        }
        if (!$scope.initRun) {
            if ($scope.letter) {
                remotingService.execute(
					"DSARemoterHubExtension.getHubsForPrefix",
					$scope.letter, !$scope.internalOnlyMode,
					{
					    success: function (result) {
					        $scope.filterResults(result);
					    }
					},
					$scope
				);
            } else {
                remotingService.execute(
					"DSARemoterHubExtension.getAllHubs",
					!$scope.internalOnlyMode,
					{
					    success: function (result) {
					        $scope.filterResults(result);
					    }
					},
					$scope
				);
            }
        }
        $scope.initRun = true;
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.initRun = false;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.initRun = false;
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.filterResults = function (result) {
        _.each($scope.alphaLists, function (alphaList) {
            alphaList.display = false;
            alphaList.sublist = [];
        });
        if (result && result.length > 0) {
            result = _.sortBy(result, "name");
            var groupedResult = _.groupBy(result, function (hub) {
                var letterKey = hub.name.charAt(0);
                if (letterKey.toLowerCase() == letterKey.toUpperCase()) {
                    letterKey = '#';
                } else {
                    letterKey = letterKey.toUpperCase();
                }
                return letterKey;
            });
            _.each(_.keys(groupedResult), function (key) {
                var labelKey = key;
                var alphaLists = _.where($scope.alphaLists, { letter: labelKey });
                alphaLists[0].sublist = alphaLists[0].sublist.concat(groupedResult[key]);
            });
            $scope.hubLists = $scope.alphaLists;
        }
    };

    $scope.filterResultsByLetter = function (letter) {
        if (letter === 'ALL') {
            $scope.letter = "";
            $scope.activeLetter = false;
        } else {
            $scope.letter = letter;
            $scope.activeLetter = true;
        }
        $scope.initRun = false;
        $scope.init();
    };

    $scope.goToAnchor = function (letter) {
        if ($scope.activeLetter) {
            $('#hub-list-wrapper #page-content').scrollTop(0);
            $('#hub-list-wrapper #page-content').scrollTop($("#" + letter).offset().top);
        }
    };

    $scope.goToHub = function (recordId) {
        $location.url('/hubs/' + recordId);
        if ($scope.mobile) {
            $scope.collapseHubList(true);
        }
    };

    $scope.$on("expandHubList2", function () {
        $scope.displayHubListClose = true;
        $scope.init();
    });

    $scope.collapseHubList = function (closeNavBar) {
        $scope.displayHubListClose = false;
        $scope.$emit("closeHubList", closeNavBar);
    };

    $scope.$on('displayHubListCloseTrue', function () {
        $scope.displayHubListClose = true;
    });

    // $scope.onresize = $window.parent.onresize;
    // $window.parent.onresize = function() {
    // 	$scope.onresize();
    // 	$scope.hubListScreenHeight = $window.innerHeight;
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;
    $window.onresize = function () {
        $scope.onresize();
        $scope.hubListScreenHeight = $window.innerHeight;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();

    if ($scope.desktop) {
        $scope.init();
    }
}]);
var app = angular.module("dsaApp");

app.controller("hubNavbarController", ["$scope", "$location", "$routeParams", "remotingService", function ($scope, $location, $routeParams, remotingService) {
    $scope.hub = {};
    $scope.hasNext = false;
    $scope.hasPrevious = false;
    $scope.playlists = [];
    $scope.position = 0;

    $scope.init = function () {
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
        }
        remotingService.execute(
			"DSARemoterHubExtension.getHubDetail",
			$scope.hubId, !$scope.internalOnlyMode,
			{
			    success: function (result) {
			        $scope.hub = result;
			        $scope.playlists = $scope.hub.playlistDetails;
			        $scope.determinePlaylistPosition();
			    }
			},
			$scope
		);
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.determinePlaylistPosition = function () {
        _.each($scope.playlists, function (playlist, index) {
            if ($routeParams.playlistId == playlist.recordId) {
                $scope.position = index;
                $scope.hasPrevious = $scope.position > 0;
                $scope.hasNext = $scope.position < ($scope.playlists.length - 1);
            }
        });
    };

    $scope.next = function () {
        if ($scope.hasNext) {
            var playlist = $scope.playlists[$scope.position + 1];
            $location.url("/playlist/" + playlist.recordId + "?hubId=" + $scope.hubId);
        }
    };

    $scope.previous = function () {
        if ($scope.hasPrevious) {
            var playlist = $scope.playlists[$scope.position - 1];
            $location.url("/playlist/" + playlist.recordId + "?hubId=" + $scope.hubId);
        }
    };

    $scope.goToHub = function () {
        $location.url("/hubs/" + $scope.hubId);
    };

    $scope.init();
}]);
var app = angular.module("dsaApp");

app.controller("macController", ["$scope", "$rootScope", "$window", "$location", "remotingService", "sessionService", function ($scope, $rootScope, $window, $location, remotingService, sessionService) {
    $scope.macHeight = 0;
    $scope.macWidth = 0;
    $scope.macRowWidth = 0;
    $scope.macSelected = false;

    $scope.init = function () {
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
            if ($scope.macSelected) {
                $location.url("/");
            }
        }
        $scope.startLoading();
        remotingService.execute(
			"DSARemoterMobileAppConfigExtension.getMobileAppConfigurations",
			{
			    success: function (result) {
			        $scope.stopLoading();
			        $scope.macs = result;
			        if (this.desktop && this.macs) {
			            this.determineDesktopMacWidth();
			        }
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
        $scope.init();
    });

    $scope.selectMac = function (mac) {
        mac.isSelected = !mac.isSelected;
        var arr = _.where($scope.macs, { isSelected: true });
        if (arr.length > 1) {
            if (mac.isSelected) {
                _.each($scope.macs, function (m) {
                    if (m.mobileAppConfigId !== mac.mobileAppConfigId) {
                        m.isSelected = false;
                    }
                });
            }
        } else if (arr.length == 0) {
            mac.isSelected = !mac.isSelected;
        }
        if (mac.isSelected) {
            $scope.macSelected = true;
            remotingService.execute(
				"DSARemoterInfoExtension.setPreferredMobileAppConfiguration",
				mac.mobileAppConfigId,
				{
				    success: function (result) {
				        $scope.info.preferredMobileAppConfiguration = mac.mobileAppConfigId;
				        $scope.$emit("infoUpdate-emit", $scope.info, mac.titleText);
				    }
				},
				$scope
			);
        }
    };

    $scope.determineDevice = function () {
        $scope.macScreenHeight = $window.innerHeight;
        $scope.macScreenWidth = $window.innerWidth;
        if ($scope.desktop && $scope.macs) {
            $scope.determineDesktopMacWidth();
        } else {
            $scope.macWidth = $scope.macScreenWidth;
            $scope.macHeight = Math.floor(200 * $scope.macWidth / 500);
        }
    };

    $scope.determineDesktopMacWidth = function () {
        $scope.macWidth = 0;
        $scope.macHeight = 0;
        $scope.remainderMacWidth = 0;
        $scope.remainderMacHeight = 0;
        $scope.remainder = 0;
        if ($scope.macs.length % 3 === 0) {
            $scope.macWidth = Math.floor(($scope.macScreenWidth - 21) / 3);
            $scope.macRowWidth = $scope.macWidth * 3 + 3;
        } else if ($scope.macs.length === 1 || $scope.macs.length === 2) {
            $scope.macWidth = Math.floor(($scope.macScreenWidth - 21) / $scope.macs.length);
            $scope.macRowWidth = $scope.macWidth * $scope.macs.length;
        } else if ($scope.macs.length % 4 === 0) {
            $scope.macWidth = Math.floor(($scope.macScreenWidth - 21) / 4);
            $scope.macRowWidth = $scope.macWidth * 4 + 4;
        } else if ($scope.macs.length) {
            $scope.remainder = $scope.macs.length % 3;
            $scope.remainder = $scope.remainder == 1 ? 4 : $scope.remainder;
            $scope.remainderMacWidth = Math.floor(($scope.macScreenWidth - 21) / $scope.remainder);
            $scope.macWidth = Math.floor(($scope.macScreenWidth - 21) / 3);
            $scope.macRowWidth = $scope.macWidth * 3 + 3;
            $scope.remainderMacHeight = Math.floor(200 * $scope.remainderMacWidth / 280);
        }
        $scope.macHeight = Math.floor(200 * $scope.macWidth / 280);
        if (!$scope.remainderMacWidth) {
            $scope.remainderMacWidth = $scope.macWidth;
        }
        if (!$scope.remainderMacHeight) {
            $scope.remainderMacHeight = $scope.macHeight;
        }
    };

    // $scope.onresize = $window.parent.onresize;

    // $window.parent.onresize = function() {
    // 	if (window.frameElement) {
    // 		window.frameElement.attributes.width.value = window.parent.innerWidth + "px";
    // 		window.frameElement.attributes.scrolling.value = "no";
    // 	}
    // 	$scope.onresize();
    // 	$scope.determineDevice();
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;

    $window.onresize = function () {
        $scope.onresize();
        $scope.desktop = $window.innerWidth >= 768;
        $scope.mobile = $window.innerWidth < 768;
        $scope.determineDevice();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();

    $scope.init();

}]);
var app = angular.module("myapp", []);

app.controller("myappController", ["$scope", function ($scope) {
    $scope.message = "hey";
}]);
var app = angular.module("dsaApp");

app.controller("navbarMenuController", ["$scope", "$rootScope", "$window", "$location", function ($scope, $rootScope, $window, $location) {
    $rootScope.desktop = false;
    $rootScope.mobile = false;
    $scope.previousNavBarHeight = "";
    $scope.displayBackButton = false;
    $scope.viewHistory = [];
    $scope.backCalled = false;
    $scope.displayHubList = false;

    $scope.templates = {
        wide: resourceUrl + '/partials/navbarMenuWide.html',
        narrow: resourceUrl + '/partials/navbarMenuNarrow.html',
        menuItems: resourceUrl + '/partials/navbarMenuItems.html',
        search: resourceUrl + '/partials/navbarMenuSearch.html',
        preferences: resourceUrl + '/partials/navbarMenuPreferences.html',
        hubList: resourceUrl + '/partials/hub-list.html'
    };

    $scope.removeWalkMe = function () {

        setTimeout(function () {
            var elements = document.getElementsByClassName('walkme-custom-icon-outer-div');
            if (elements && elements.length > 0)
                elements[0].style.display = 'none';
        }, 3000);
    }

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
    });

    $scope.navigateToSF = function () {
        if (window.sforce && window.sforce.one) {
            window.sforce.one.back();
        } else {
            window.location.href = location.protocol + '//' + location.hostname + '/home/home.jsp';
        }

    }

    $scope.determineDevice = function () {
        // if (window.frameElement) {
        // 	$scope.navbarMenuScreenWidth = +window.frameElement.attributes.width.value.replace("px","");
        // } else {
        $scope.navbarMenuScreenWidth = $window.innerWidth;
        // }

        $rootScope.desktop = $rootScope.navbarMenuScreenWidth >= 768;
        $rootScope.mobile = $rootScope.navbarMenuScreenWidth < 768;
        $(".navbar").removeAttr("style");
        $rootScope.screenHeight = $window.innerHeight;
    };

    $scope.determineDevice();

    $scope.determineBackButtonDisplay = function () {
        $scope.displayBackButton = $rootScope.mobile && $location.url() !== '/';
    };

    // $window.parent.onresize = function() {
    // 	if (window.frameElement) {
    // 		window.frameElement.attributes.width.value = window.parent.innerWidth + "px";
    // 		window.frameElement.attributes.scrolling.value = "no";
    // 	}
    // 	$scope.determineDevice();
    // 	$scope.determineBackButtonDisplay();
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };

    $scope.onresize = $window.onresize;
    $window.onresize = function () {
        if ($scope.onresize) {
            $scope.onresize();
        }
        $scope.determineDevice();
        $scope.determineBackButtonDisplay();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.closeNavBar = function (closeNavBar) {
        if (closeNavBar) {
            var elem = $("#menu-collapse");
            if (elem.hasClass("collapse") && elem.hasClass("in")) {
                $scope.resizeNavbarCollapseHeight();
                $(".navbar-toggle").trigger("click");
            }
        }
    };

    $scope.$on("closeHubList2", function (event, closeNavBar) {
        $scope.closeNavBar(closeNavBar);
    });

    $scope.$on("closePlaylistList2", function (event, closeNavBar) {
        $scope.closeNavBar(closeNavBar);
    });

    $scope.$on("closeContentList2", function (event, closeNavBar) {
        $scope.closeNavBar(closeNavBar);
    });

    $rootScope.$on("$locationChangeSuccess", function () {
        $scope.determineBackButtonDisplay();
    });

    $scope.goBack = function () {
        $scope.backCalled = true;
        var path = $scope.viewHistory.pop();
        $location.url(path);
    };

    $scope.goHome = function () {
        $location.url('/');
        if ($scope.mobile) {
            var elem = $("#menu-collapse");
            if (elem.hasClass("collapse") && elem.hasClass("in")) {
                $scope.resizeNavbarCollapseHeight();
                $(".navbar-toggle").trigger("click");
            }
        }
    };

    $scope.goToAllHubs = function () {
        if ($scope.mobile) {
            $scope.$emit("expandHubList");
        } else {
            $location.url('hubList');
        }
    };

    $scope.goToAllPlaylists = function () {
        if ($scope.mobile) {
            $scope.$emit("expandPlaylistList");
        } else {
            $location.url('playlistList');
        }
    };

    $scope.goToAllContents = function () {
        if ($scope.mobile) {
            $scope.$emit("expandContentList");
        } else {
            $location.url('contentList');
        }
    };

    $scope.goToMyContent = function () {
        if ($scope.mobile) {
            $location.url("myContent");
        } else {
            $location.url("myContent");
        }
    };

    $scope.$on('displayHubListFalse', function () {
        $scope.displayHubList = false;
    });

    $scope.$on('displayHubListCloseFalse', function () {
        $scope.displayHubListClose = false;
    });

    $scope.$on("$locationChangeStart", function (ev, next, current) {
        if (!$scope.backCalled) {
            var currentPath = current.substring(current.indexOf('#') + 1);
            var nextPath = next.substring(next.indexOf('#') + 1);
            if (currentPath.indexOf('playlist') !== -1 && nextPath.indexOf('content') !== -1 && currentPath.indexOf('playlistOpen') === -1) {
                currentPath += '?playlistOpen=1';
            }
            $scope.viewHistory.push(currentPath);
        }
        $scope.backCalled = false;
    });

    $scope.resizeNavbarCollapseHeight = function () {
        var elem = $("#menu-collapse");
        if (elem.hasClass("collapse") && elem.hasClass("in")) {
            $(".navbar").css({
                overflowY: "visible"
            });
            $(".navbar").animate({
                height: $scope.previousNavBarHeight
            });
            $(".navbar").removeAttr("style");
        } else {
            $scope.previousNavBarHeight = $(".navbar").css("height");
            $(".navbar").css({
                overflowY: "auto"
            });
            $(".navbar").animate({
                height: $window.innerHeight
            });
        }
    };
}]);
var app = angular.module("dsaApp");

app.controller("ngViewController", ["$scope", "$window", "$location", function ($scope, $window, $location) {

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.determineDevice = function () {
        // if (window.frameElement) {
        // 	$scope.screenWidth = +window.frameElement.attributes.width.value.replace("px","");
        // } else {
        $scope.screenWidth = $window.innerWidth;
        // }
        $scope.desktop = $scope.screenWidth >= 768;
        $scope.mobile = $scope.screenWidth < 768;
        $scope.screenHeight = $window.innerHeight;

        //this jQuery must be here so that the SF1 mobile layout doesn't change to desktop
        //$("body").css("width", $scope.screenWidth);
    };

    // $scope.onresize = $window.parent.onresize;
    // $window.parent.onresize = function() {
    // 	if (window.frameElement) {
    // 		window.frameElement.attributes.width.value = window.parent.innerWidth + "px";
    // 		window.frameElement.attributes.scrolling.value = "no";
    // 	}
    // 	$scope.onresize();
    // 	$scope.determineDevice();
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;
    $window.onresize = function () {
        $scope.onresize();
        $scope.desktop = $window.innerWidth >= 768;
        $scope.mobile = $window.innerWidth < 768;
        //$scope.determineDevice();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();

}]);
var app = angular.module("dsaApp");

app.controller("parentCategoryNavbarController", ["$scope", "$location", "$routeParams", "remotingService", "sessionService", function ($scope, $location, $routeParams, remotingService, sessionService) {
    $scope.parentCategory = {};
    $scope.initialHierarchy = [];
    $scope.hierarchy = [];
    $scope.showHierarchy = false;

    $scope.init = function () {
        $scope.initialHierarchy = [];
        $scope.hierarchy = [];
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
        }
        $scope.getParentCategory($routeParams.categoryId);
    };

    $scope.sectiontitleClick = function () {
        $('#sitemap').slideToggle();
        $(this).toggleClass('open');
    }


    $scope.getParentCategory = function (categoryId) {
        remotingService.execute(
			"DSARemoterCategoryExtension.getParentCategoryWithMAC",
			categoryId,
			$scope.info.preferredMobileAppConfiguration,
			{
			    success: function (result) {
			        if (_.isEmpty($scope.parentCategory)) {
			            $scope.parentCategory = result;
			        } else {
			            $scope.initialHierarchy.push(result);
			        }
			        if (result.isTopLevel || !result.categoryId) {
			            $scope.handleHierarchy();
			        } else {
			            $scope.getParentCategory(result.categoryId);
			        }
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.handleHierarchy = function () {
        if ($scope.initialHierarchy.length > 0) {
            for (var i = $scope.initialHierarchy.length - 1; i >= 0; i--) {
                $scope.hierarchy.push($scope.initialHierarchy[i]);
            }
        }
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.slideDownHierarchy = function () {
        $("#parent-category-hierarchy-wrapper").slideDown();
        $scope.showHierarchy = true;
    };

    $scope.slideUpHierarchy = function () {
        $("#parent-category-hierarchy-wrapper").slideUp();
        $scope.showHierarchy = false;
    };

    $scope.goToCategory = function (categoryId) {
        var link = "/category/";
        if (categoryId) {
            link += categoryId;
        } else {
            link += $scope.parentCategory.categoryId;
        }
        $location.url(link);
    };

    $scope.init();
}]);
var app = angular.module("dsaApp");

app.controller("playlistController", ["$scope", "$window", "$routeParams", "$location", "remotingService", "sessionService", function ($scope, $window, $routeParams, $location, remotingService, sessionService) {
    $scope.playlistScreenHeight = 0;
    $scope.playlist = {};
    $scope.displayPlaylistClose = false;
    $scope.editingContent = false;
    $scope.editingPlaylist = false;
    $scope.posts = [];
    $scope.myPost = {
        Body: ""
    };
    $scope.hubId = '';
    $scope.chatterEnabled = false;
    $scope.deviceList = ["desktop", "ipad", "iphone", "ipod", "androidPhone", "androidTablet", "blackberryPhone", "blackberryTablet", "windowsPhone", "windowsTablet", "fxosPhone", "fxosTablet"];
    $scope.orientationList = ["landscape", "portrait"];
    $scope.myPlaylistIconUrl = resourceUrl + '/icons/standard/Playlist3.png';
    $scope.contentIcon = resourceUrl + '/icons/standard/document_blank.png';

    $scope.init = function () {
        if ($scope.info && $scope.info.user) {
            $scope.chatterEnabled = $scope.info.isChatterEnabled;
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
        }
        $scope.hubId = $routeParams.hubId;
        if ($scope.hubId) {
            $scope.hubPresent = true;
        }
        $scope.getPlaylistDetail();
        $scope.getPlaylistPosts();
        $scope.logPlaylistReview();
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        $scope.chatterEnabled = $scope.info.isChatterEnabled;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.logPlaylistReview = function () {
        var deviceName = "";
        _.each($scope.deviceList, function (deviceOption) {
            if (device[deviceOption]()) {
                deviceName = deviceOption;
            }
        });
        var orientationName = "";
        _.each($scope.orientationList, function (orientationOption) {
            if (device[orientationOption]()) {
                orientationName = orientationOption;
            }
        });
        remotingService.execute(
			"DSARemoterPlaylistExtension.logPlaylistReview",
			$routeParams.playlistId, deviceName, orientationName,
			{
			    success: function (result) {

			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    // $scope.thumbsUpComment = function(itemId) {
    // 	remotingService.execute(
    // 		"DSARemoterPlaylistExtension.thumbsUpComment",
    // 		itemId,
    // 		{
    // 			success: function(result) {
    // 				$scope.getPlaylistPosts();
    // 			}
    // 		},
    // 		$scope
    // 	);
    // };

    // $scope.thumbsUpPost = function(itemId) {
    // 	remotingService.execute(
    // 		"DSARemoterPlaylistExtension.thumbsUpPost",
    // 		itemId,
    // 		{
    // 			success: function(result) {
    // 				$scope.getPlaylistPosts();
    // 			}
    // 		},
    // 		$scope
    // 	);
    // };

    $scope.addLike = function (itemId) {
        remotingService.execute(
			"DSARemoterPlaylistExtension.addLike",
			itemId,
			{
			    success: function (result) {
			        $scope.getPlaylistPosts();
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.removeLike = function (likeId) {
        remotingService.execute(
			"DSARemoterPlaylistExtension.removeLike",
			likeId,
			{
			    success: function (result) {
			        $scope.getPlaylistPosts();
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.likePost = function (post) {
        if (post.feedLikesSummary.iLiked) {
            $scope.removeLike(post.feedLikesSummary.likedId);
        } else {
            $scope.addLike(post.post.Id);
        }
    };

    $scope.likeComment = function (comment) {
        if (comment.feedLikesSummary.iLiked) {
            $scope.removeLike(comment.feedLikesSummary.likedId);
        } else {
            $scope.addLike(comment.comment.Id);
        }
    };

    $scope.togglePosts = function () {
        $(".comment").not(".last-post").slideToggle(function () {
            var commentForm = $(".comment-form");
            if (commentForm.css("display") == "block") {
                commentForm.css({ display: "table" });
            }
        });
    };

    $scope.addPost = function () {
        if ($scope.myPost.Body) {
            remotingService.execute(
				"DSARemoterPlaylistExtension.postOnPlaylist",
				$routeParams.playlistId, $scope.myPost.Body,
				{
				    success: function (result) {
				        $(".comment").removeAttr("style");
				        $scope.getPlaylistPosts();
				        $scope.myPost.Body = "";
				    },
				    error: function (error) {
				        $scope.stopLoading();
				        sessionService.checkSession(error.message);
				    }
				},
				$scope
			);
            document.activeElement.blur();
            $("input").blur();
        }
    };

    $scope.getPlaylistPosts = function () {
        remotingService.execute(
			"DSARemoterPlaylistExtension.getPlaylistPosts",
			$routeParams.playlistId,
			{
			    success: function (result) {
			        $scope.posts = result;
			        $scope.summarizeFeedLikes();
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.summarizeFeedLikes = function () {
        _.each($scope.posts, function (post) {
            var feedLikesSummary = {
                total: 0,
                iLiked: false,
                likedId: ""
            };
            if (post.post.FeedLikes) {
                feedLikesSummary.total = post.post.FeedLikes.length;
                _.each(post.post.FeedLikes, function (feedLike) {
                    // compare user id with feed like created by id
                    if (feedLike.CreatedBy.Id == $scope.info.user.recordId) {
                        feedLikesSummary.iLiked = true;
                        feedLikesSummary.likedId = feedLike.Id;
                    }
                });
            }
            post.feedLikesSummary = feedLikesSummary;
            if (post.comments && post.comments.length > 0) {
                _.each(post.comments, function (comment) {
                    var subFeedLikesSummary = {
                        total: 0,
                        iLiked: false,
                        likedId: ""
                    };
                    if (comment.commentLikes) {
                        subFeedLikesSummary.total = comment.commentLikes.length;
                        _.each(comment.commentLikes, function (commentLike) {
                            if (commentLike.chatterLike.user.id == $scope.info.user.recordId) {
                                subFeedLikesSummary.iLiked = true;
                                subFeedLikesSummary.likedId = commentLike.chatterLike.id;
                            }
                        });
                    }
                    comment.feedLikesSummary = subFeedLikesSummary;
                });
            }
        });
    };

    $scope.changePlaylistEditMode = function () {
        $scope.editingPlaylist = !$scope.editingPlaylist;
        if (!$scope.editingPlaylist) {
            remotingService.execute(
				"DSARemoterPlaylistExtension.updatePlaylist",
				$routeParams.playlistId, $scope.playlist.name, (typeof ($scope.playlist.description) !== 'undefined') ? $scope.playlist.description : null, $scope.playlist.isFeatured,
				{
				    success: function (result) {
				        $scope.getPlaylistDetail();
				    },
				    error: function (error) {
				        $scope.stopLoading();
				        sessionService.checkSession(error.message);
				    }
				},
				$scope
			);
            document.activeElement.blur();
            $("input").blur();
        }
    };

    $scope.changeContentEditMode = function () {
        $scope.editingContent = !$scope.editingContent;
    };

    $scope.enableSorting = function () {
        $("#sortable").sortable({
            cancel: ".section-list-item-delete",
            stop: $scope.saveNewOrder
        });
    };

    $scope.destroySorting = function () {
        $("#sortable").sortable("destroy");
    };

    $scope.saveNewOrder = function (event, ui) {
        var orderMap = {};
        $(".sortable-item").each(function (index) {
            var contentDocumentId = $(this).data("contentId");
            orderMap[contentDocumentId] = index;
        });
        remotingService.execute(
			"DSARemoterPlaylistExtension.orderPlaylist",
			$routeParams.playlistId, orderMap,
			{
			    success: function (result) {

			    }
			},
			$scope
		);
    };

    $scope.getPlaylistDetail = function () {
        $scope.startLoading();
        remotingService.execute(
			"DSARemoterPlaylistExtension.getPlaylistDetail",
			$routeParams.playlistId,
			{
			    success: function (result) {
			        $scope.stopLoading();
			        $scope.playlist = result;
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.removeFromPlaylist = function (playlistId, documentId, event) {
        if (playlistId && documentId) {
            if (event) {
                $(event.target).parent().fadeOut();
            }
            remotingService.execute(
				"DSARemoterPlaylistExtension.removeFromPlaylist",
				playlistId, documentId,
				{
				    success: function (result) {
				        $scope.getPlaylistDetail();
				    },
				    error: function (error) {
				        $scope.stopLoading();
				        sessionService.checkSession(error.message);
				    }
				},
				$scope
			);
        }
    };

    $scope.followPlaylist = function () {
        remotingService.execute(
			"DSARemoterPlaylistExtension.followPlaylist",
			$routeParams.playlistId,
			{
			    success: function (result) {
			        $scope.init();
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.unfollowPlaylist = function () {
        remotingService.execute(
			"DSARemoterPlaylistExtension.unFollowPlaylist",
			$routeParams.playlistId,
			{
			    success: function (result) {
			        $scope.init();
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.openPlaylistContent = function () {
        if ($scope.mobile && !$scope.displayPlaylistClose) {
            $scope.displayPlaylistClose = true;
            $scope.playlistContentTop = $(".playlistContent").position().top;
            $(".playlistContent").css({
                "position": "absolute",
                backgroundColor: "#1e2021",
                width: "100%",
                height: $window.innerHeight + "px",
                "z-index": "100000",
                top: $scope.playlistContentTop
            });
            $(".playlistContent .section-header").css({
                marginBottom: "20px"
            })
            $(".playlistContent .section-list").show();
            $(".playlistContent").css({
                top: 0
            });
        }
    };

    $scope.expandPlaylistContent = function () {
        if ($scope.mobile) {
            if (!$scope.displayPlaylistClose) {
                $scope.displayPlaylistClose = true;
                $scope.playlistContentTop = $(".playlistContent").position().top;
                $(".playlistContent").css({
                    "position": "absolute",
                    backgroundColor: "#1e2021",
                    width: "100%",
                    height: $window.innerHeight + "px",
                    "z-index": "100000",
                    top: $scope.playlistContentTop
                });
                $(".playlistContent .section-header").css({
                    marginBottom: "20px"
                })
                $(".playlistContent .section-list").show();
                $(".playlistContent").animate({
                    top: 0
                });
            } else {
                $scope.collapsePlaylistContent();
            }
        }
    };

    $scope.collapsePlaylistContent = function () {
        $scope.displayPlaylistClose = false;
        $(".playlistContent").animate({
            top: $scope.playlistContentTop
        }, function () {
            $(this).removeAttr("style");
            $(".playlistContent .section-list").removeAttr("style");
            $(".playlistContent .section-header").removeAttr("style");
        });
    };

    $scope.goToContent = function (content) {
        var link = "/content/" + content.contentDocumentId + "?playlistId=" + $scope.playlist.recordId;
        if ($scope.hubPresent) {
            link += "&hubId=" + $scope.hubId;
        }
        $location.url(link);
    };

    // $scope.onresize = $window.parent.onresize;
    // $window.parent.onresize = function() {
    // 	$scope.onresize();
    // 	$scope.playlistScreenHeight = $window.innerHeight;
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;
    $window.onresize = function () {
        $scope.onresize();
        $scope.desktop = $window.innerWidth >= 768;
        $scope.mobile = $window.innerWidth < 768;
        $scope.playlistScreenHeight = $window.innerHeight;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();

    $scope.init();
}]);
var app = angular.module("dsaApp");

app.controller("playlistEditController", ["$scope", "$window", "$location", "remotingService", "sessionService", function ($scope, $window, $location, remotingService, sessionService) {
    $scope.newPlaylist = {
        newPlaylistTitle: "",
        newPlaylistDescription: "",
        newPlaylistIsFeatured: false
    };
    $scope.myPlaylists = [];

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
    });



    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.$on("openAddToPlaylist", function () {
        $scope.getExistingPlaylists();
        $("#addToPlaylist-menu").css({
            height: $window.innerHeight,
            overflowY: "auto"
        });
        if ($scope.mobile) {
            $("#addToPlaylist-menu").show().animate({
                top: 0
            });
        } else if ($scope.desktop) {
            if ($scope.isStream) {
                $(".contentThumbnail iframe").height(0);
            }
            $("#addToPlaylist-menu").fadeIn();
        }
    });

    $scope.$on("closeAddToPlaylist", function () {
        $scope.closeAddTo();
    });

    $scope.$on("openRemoveFromPlaylist", function () {
        $scope.getExistingPlaylists();
        if ($scope.mobile) {
            $("#removeFromPlaylist-menu").show().animate({
                bottom: 0
            });
        } else if ($scope.desktop) {
            if ($scope.isStream) {
                $(".contentThumbnail iframe").height(0);
            }
            $("#removeFromPlaylist-menu").fadeIn();
        }
    });

    $scope.$on("closeRemoveFromPlaylist", function () {
        $scope.closeRemoveFrom();
    });

    $scope.closeAddTo = function () {
        if ($scope.mobile) {
            $("#addToPlaylist-menu").animate({
                top: 1000
            }, function () {
                $(this).removeAttr("style");
            });
        } else if ($scope.desktop) {
            if ($scope.isStream) {
                $(".contentThumbnail iframe").removeAttr("style");
            }
            $("#addToPlaylist-menu").fadeOut();
        }
    };

    $scope.closeRemoveFrom = function () {
        if ($scope.mobile) {
            $("#removeFromPlaylist-menu").animate({
                bottom: -1000
            }, function () {
                $(this).removeAttr("style");
            });
        } else if ($scope.desktop) {
            if ($scope.isStream) {
                $(".contentThumbnail iframe").removeAttr("style");
            }
            $("#removeFromPlaylist-menu").fadeOut();
        }
    };

    $scope.getExistingPlaylists = function () {
        remotingService.execute(
			"DSARemoterPlaylistExtension.getMyPlaylists",
			{
			    success: function (result) {
			        result = _.sortBy(result, "name");
			        $scope.myPlaylists = result;
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };



    $scope.removeFromPlaylist = function (playlistId, documentId) {
        if (playlistId && documentId) {
            remotingService.execute(
				"DSARemoterPlaylistExtension.removeFromPlaylist",
				playlistId, documentId,
				{
				    success: function (result) {

				    },
				    error: function (error) {
				        $scope.stopLoading();
				        sessionService.checkSession(error.message);
				    }
				},
				$scope
			);
            $scope.closeRemoveFrom();
            $scope.$emit("closeActions");
        }
    };

    $scope.addToPlaylist = function (playlistId, documentId) {
        if (playlistId && documentId) {
            remotingService.execute(
				"DSARemoterPlaylistExtension.addToPlaylist",
				playlistId, documentId,
				{
				    success: function (result) {

				    },
				    error: function (error) {
				        $scope.stopLoading();
				        sessionService.checkSession(error.message);
				    }
				},
				$scope
			);
            $scope.closeAddTo();
            $scope.$emit("closeActions");
        }
    };

    $scope.createAndAddToPlaylist = function (documentId) {
        if ($scope.newPlaylist.newPlaylistTitle && documentId) {
            if (!$scope.newPlaylist.newPlaylistDescription) {
                $scope.newPlaylist.newPlaylistDescription = ' ';
            }
            if (!$scope.newPlaylist.newPlaylistIsFeatured) {
                $scope.newPlaylist.newPlaylistIsFeatured = false;
            }
            remotingService.execute(
				"DSARemoterPlaylistExtension.createPlaylist",
				$scope.newPlaylist.newPlaylistTitle, $scope.newPlaylist.newPlaylistDescription, $scope.newPlaylist.newPlaylistIsFeatured,
				{
				    success: function (result) {
				        $scope.addToPlaylist(result.recordId, documentId);
				        $scope.newPlaylist = {
				            newPlaylistTitle: "",
				            newPlaylistDescription: "",
				            newPlaylistIsFeatured: false
				        };
				    },
				    error: function (error) {
				        $scope.stopLoading();
				        sessionService.checkSession(error.message);
				    }
				},
				$scope
			);
        }
        document.activeElement.blur();
        $("input").blur();
    };

}]);
var app = angular.module("dsaApp");

app.controller("playlistListController", ["$scope", "$route", "$window", "$location", "$routeParams", "remotingService", "sessionService", function ($scope, $route, $window, $location, $routeParams, remotingService, sessionService) {
    $scope.alphaLists = [
		{ letter: "#", sublist: [], display: false },
		{ letter: "A", sublist: [], display: false }, { letter: "B", sublist: [], display: false }, { letter: "C", sublist: [], display: false }, { letter: "D", sublist: [], display: false }, { letter: "E", sublist: [], display: false }, { letter: "F", sublist: [], display: false },
		{ letter: "G", sublist: [], display: false }, { letter: "H", sublist: [], display: false }, { letter: "I", sublist: [], display: false }, { letter: "J", sublist: [], display: false }, { letter: "K", sublist: [], display: false }, { letter: "L", sublist: [], display: false },
		{ letter: "M", sublist: [], display: false }, { letter: "N", sublist: [], display: false }, { letter: "O", sublist: [], display: false }, { letter: "P", sublist: [], display: false }, { letter: "Q", sublist: [], display: false }, { letter: "R", sublist: [], display: false },
		{ letter: "S", sublist: [], display: false }, { letter: "T", sublist: [], display: false }, { letter: "U", sublist: [], display: false }, { letter: "V", sublist: [], display: false }, { letter: "W", sublist: [], display: false }, { letter: "X", sublist: [], display: false },
		{ letter: "Y", sublist: [], display: false }, { letter: "Z", sublist: [], display: false }
    ];
    $scope.templates = {
        playlistList: resourceUrl + '/partials/playlist-list.html'
    };
    $scope.initRun = false;
    $scope.playlistLists = [];
    $scope.category = $routeParams.category;
    $scope.pageNumber = 1;
    $scope.showPrevious = false;
    $scope.showNext = false;
    $scope.editing = false;
    $scope.letter = "";
    $scope.activeLetter = false;
    $scope.myPlaylistIconUrl = resourceUrl + '/icons/standard/Playlist3.png';
    $scope.contentIcon = resourceUrl + '/icons/standard/document_blank.png';

    $scope.init = function () {
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
        }
        if (!$scope.initRun) {
            $scope.getPlaylists(1);
        }
        $scope.initRun = true;
    };

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.initRun = false;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.initRun = false;
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.changeEditMode = function () {
        $scope.editing = !$scope.editing;
    };

    $scope.deletePlaylist = function (recordId, event) {
        if (event) {
            $(event.target).parent().fadeOut();
        }
        remotingService.execute(
			"DSARemoterPlaylistExtension.deletePlaylist",
			recordId,
			{
			    success: function (result) {
			        $scope.getPlaylists($scope.pageNumber);
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.getPlaylists = function (pageNumber) {
        $scope.startLoading();
        console.log("$scope.info.preferredMobileAppConfiguration: ", $scope.info.preferredMobileAppConfiguration);
        switch ($scope.category) {
            case "":
            case null:
            case undefined:
                if ($scope.letter) {
                    remotingService.execute(
						"DSARemoterPlaylistExtension.getPlaylistsForPrefixMAC",
						$scope.letter, $scope.info.preferredMobileAppConfiguration,
						{
						    success: function (result) {
						        var resultObj = {
						            items: result,
						            pageNumber: 1,
						            totalPages: 1,
						            totalItems: result.length
						        }
						        $scope.handleResult(resultObj);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                } else {
                    remotingService.execute(
						"DSARemoterPlaylistExtension.getPlaylistsMAC",
						pageNumber, $scope.info.preferredMobileAppConfiguration,
						{
						    success: function (result) {
						        $scope.handleResult(result);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                }
                break;
            case 'my':
                if ($scope.letter) {
                    remotingService.execute(
						"DSARemoterPlaylistExtension.getMyPlaylistsForPrefix",
						$scope.letter,
						{
						    success: function (result) {
						        var resultObj = {
						            items: result,
						            pageNumber: 1,
						            totalPages: 1,
						            totalItems: result.length
						        }
						        $scope.handleResult(resultObj);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                } else {
                    remotingService.execute(
						"DSARemoterPlaylistExtension.getMyPlaylists",
						{
						    success: function (result) {
						        var resultObj = {
						            items: result,
						            pageNumber: 1,
						            totalPages: 1,
						            totalItems: result.length
						        }
						        $scope.handleResult(resultObj);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                }
                break;
            case 'featured':
                if ($scope.letter) {
                    remotingService.execute(
						"DSARemoterPlaylistExtension.getFeaturedPlaylistsForPrefix",
						$scope.letter,
						{
						    success: function (result) {
						        var resultObj = {
						            items: result,
						            pageNumber: 1,
						            totalPages: 1,
						            totalItems: result.length
						        }
						        $scope.handleResult(resultObj);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                } else {
                    remotingService.execute(
						"DSARemoterPlaylistExtension.getFeaturedPlaylists",
						{
						    success: function (result) {
						        var resultObj = {
						            items: result,
						            pageNumber: 1,
						            totalPages: 1,
						            totalItems: result.length
						        }
						        $scope.handleResult(resultObj);
						    },
						    error: function (error) {
						        $scope.stopLoading();
						        sessionService.checkSession(error.message);
						    }
						},
						$scope
					);
                }
                break;
            case 'favorite':
                if ($scope.letter) {
                    remotingService.execute(
                        "DSARemoterPlaylistExtension.getFavoritePlaylistsForPrefix",
                        $scope.letter,
                        {
                            success: function (result) {
                                var resultObj = {
                                    items: result,
                                    pageNumber: 1,
                                    totalPages: 1,
                                    totalItems: result.length
                                }
                                $scope.handleResult(resultObj);
                            },
                            error: function (error) {
                                $scope.stopLoading();
                                sessionService.checkSession(error.message);
                            }
                        },
                        $scope
                    );
                } else {
                    remotingService.execute(
                        "DSARemoterPlaylistExtension.getFavoritePlaylists",
                        {
                            success: function (result) {
                                var resultObj = {
                                    items: result,
                                    pageNumber: 1,
                                    totalPages: 1,
                                    totalItems: result.length
                                }
                                $scope.handleResult(resultObj);
                            },
                            error: function (error) {
                                $scope.stopLoading();
                                sessionService.checkSession(error.message);
                            }
                        },
                        $scope
                    );
                }
                break;
            case 'following':
                remotingService.execute(
					"DSARemoterPlaylistExtension.getFollowedPlaylists",
					{
					    success: function (result) {
					        var resultObj = {
					            items: result,
					            pageNumber: 1,
					            totalPages: 1,
					            totalItems: result.length
					        }
					        $scope.handleResult(resultObj);
					    },
					    error: function (error) {
					        $scope.stopLoading();
					        sessionService.checkSession(error.message);
					    }
					},
					$scope
				);
                break;
            case 'trending':
                remotingService.execute(
					"DSARemoterPlaylistExtension.getTrendingPlaylistByViews",
					{
					    success: function (result) {
					        var resultObj = {
					            items: result,
					            pageNumber: 1,
					            totalPages: 1,
					            totalItems: result.length
					        }
					        $scope.handleResult(resultObj);
					    },
					    error: function (error) {
					        $scope.stopLoading;
					        sessionService.checkSession(error.message);
					    }
					},
					$scope
				);
                break;
        }
    };

    $scope.handleResult = function (result) {
        $scope.stopLoading();
        $scope.pageNumber = result.pageNumber;
        $scope.showPrevious = $scope.pageNumber > 1;
        $scope.showNext = $scope.pageNumber < result.totalPages;
        if ($scope.category != 'trending') {
            $scope.filterResults(result.items, result);
        } else {
            $scope.playlistLists = result.items;
        }
    };

    $scope.getPrevious = function () {
        if ($scope.showPrevious) {
            $scope.pageNumber--;
            $scope.getPlaylists($scope.pageNumber);
        }
    };

    $scope.getNext = function () {
        if ($scope.showNext) {
            $scope.pageNumber++;
            $scope.getPlaylists($scope.pageNumber);
        }
    };

    $scope.filterResults = function (result, resultObj) {
        _.each($scope.alphaLists, function (alphaList) {
            alphaList.display = false;
            alphaList.sublist = [];
        });
        //if (result && result.length > 0) {
        if (result) {
            result = _.sortBy(result, "name");
            var groupedResult = _.groupBy(result, function (playlist) {
                var letterKey = playlist.name.charAt(0);
                if (letterKey.toLowerCase() == letterKey.toUpperCase()) {
                    letterKey = '#';
                } else {
                    letterKey = letterKey.toUpperCase();
                }
                return letterKey;
            });
            _.each(_.keys(groupedResult), function (key) {
                var labelKey = key;
                var alphaLists = _.where($scope.alphaLists, { letter: labelKey });
                alphaLists[0].sublist = alphaLists[0].sublist.concat(groupedResult[key]);
                alphaLists[0].display = true;
            });
            var letters = _.sortBy(_.keys(groupedResult));
            var index = 0;
            if (resultObj.totalPages == 1) {
                _.each($scope.alphaLists, function (alphaList) {
                    alphaList.display = true;
                });
            } else if (resultObj.totalPages > 1) {
                if (resultObj.pageNumber == 1) {
                    while ($scope.alphaLists[index].letter !== _.last(letters)) {
                        $scope.alphaLists[index].display = true;
                        index++;
                    }
                } else {
                    while ($scope.alphaLists[index].letter !== _.first(letters)) {
                        index++;
                    }
                    if (resultObj.pageNumber == resultObj.totalPages) {
                        while (index < $scope.alphaLists.length) {
                            $scope.alphaLists[index].display = true;
                            index++;
                        }
                    } else {
                        while ($scope.alphaLists[index].letter !== _.last(letters)) {
                            $scope.alphaLists[index].display = true;
                            index++;
                        }
                    }
                }
            }
            $scope.playlistLists = $scope.alphaLists;
        }
    };

    $scope.filterResultsByLetter = function (letter) {
        if (letter === 'ALL') {
            $scope.letter = "";
            $scope.activeLetter = false;
        } else {
            $scope.letter = letter;
            $scope.activeLetter = true;
        }
        $scope.initRun = false;
        $scope.init();
    };

    $scope.goToAnchor = function (letter) {
        //if ($("#" + letter + ".active-letter").length) {
        console.log('activeLetter: ' + $scope.activeLetter);
        if ($scope.activeLetter) {
            $('#playlist-list-wrapper #page-content').scrollTop(0);
            $('#playlist-list-wrapper #page-content').scrollTop($("#" + letter).offset().top);
            //$('#playlist-list-wrapper #page-content').scrollTop($("#" + letter + ".active-letter").offset().top);
        }
    };

    $scope.goToPlaylist = function (recordId) {
        $location.url('/playlist/' + recordId);
        if ($scope.mobile) {
            $scope.collapsePlaylistList(true);
        }
    };

    $scope.goToCategory = function (category) {
        $scope.editing = false;
        $scope.pageNumber = 1;
        $scope.letter = "";
        if ($scope.mobile) {
            $scope.category = category;
            $scope.getPlaylists($scope.pageNumber);
        } else {
            $location.url('/playlistList/' + category);
        }
    };

    $scope.$on("expandPlaylistList2", function (event, category) {
        $scope.displayPlaylistListClose = true;
        $scope.goToCategory(category);
    });

    $scope.slideNewPlaylistForm = function () {
        $("#new-playlist-form").slideToggle();
    };

    $scope.createAndAddToPlaylist = function () {
        if ($scope.newPlaylist.newPlaylistTitle) {
            if (!$scope.newPlaylist.newPlaylistDescription) {
                $scope.newPlaylist.newPlaylistDescription = ' ';
            }
            if (!$scope.newPlaylist.newPlaylistIsFeatured) {
                $scope.newPlaylist.newPlaylistIsFeatured = false;
            }
            remotingService.execute(
				"DSARemoterPlaylistExtension.createPlaylist",
				$scope.newPlaylist.newPlaylistTitle, $scope.newPlaylist.newPlaylistDescription, $scope.newPlaylist.newPlaylistIsFeatured,
				{
				    success: function (result) {
				        $scope.newPlaylist = {
				            newPlaylistTitle: "",
				            newPlaylistDescription: "",
				            newPlaylistIsFeatured: false
				        };
				    },
				    error: function (error) {
				        $scope.stopLoading();
				        sessionService.checkSession(error.message);
				    }
				},
				$scope
			);
        }
        $route.reload();
        //$scope.slideNewPlaylistForm();
    };

    $scope.collapsePlaylistList = function (closeNavBar) {
        $scope.displayPlaylistListClose = false;
        $scope.$emit("closePlaylistList", closeNavBar);
    };

    $scope.$on('displayPlaylistListCloseTrue', function () {
        $scope.displayPlaylistListClose = true;
    });

    // $scope.onresize = $window.parent.onresize;
    // $window.parent.onresize = function() {
    // 	$scope.onresize();
    // 	$scope.playlistListScreenHeight = $window.innerHeight;
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;
    $window.onresize = function () {
        $scope.onresize();
        $scope.desktop = $window.innerWidth >= 768;
        $scope.mobile = $window.innerWidth < 768;
        $scope.playlistListScreenHeight = $window.innerHeight;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();

    if ($scope.desktop) {
        $scope.init();
    }
}]);
var app = angular.module("dsaApp");

app.controller("playlistNavbarController", ["$scope", "$location", "$routeParams", "remotingService", "sessionService", function ($scope, $location, $routeParams, remotingService, sessionService) {
    $scope.playlist = {};
    $scope.hasNext = false;
    $scope.hasPrevious = false;
    $scope.playlistItems = [];
    $scope.position = 0;
    $scope.hubId = $routeParams.hubId;

    $scope.init = function () {
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
        }
        remotingService.execute(
			"DSARemoterPlaylistExtension.getPlaylistDetail",
			$scope.playlistId,
			{
			    success: function (result) {
			        $scope.playlist = result;
			        $scope.playlistItems = $scope.playlist.contentItems;
			        $scope.determineContentPosition();
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };



    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.init();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.determineContentPosition = function () {
        _.each($scope.playlistItems, function (contentItem, index) {
            if ($routeParams.contentId == contentItem.contentDocumentId) {
                $scope.position = index;
                $scope.hasPrevious = $scope.position > 0;
                $scope.hasNext = $scope.position < ($scope.playlistItems.length - 1);
            }
        });
    };

    $scope.next = function () {
        if ($scope.hasNext) {
            var content = $scope.playlistItems[$scope.position + 1];
            $location.url("/content/" + content.contentDocumentId + "?playlistId=" + $scope.playlistId);
        }
    };

    $scope.previous = function () {
        if ($scope.hasPrevious) {
            var content = $scope.playlistItems[$scope.position - 1];
            $location.url("/content/" + content.contentDocumentId + "?playlistId=" + $scope.playlistId);
        }
    };

    $scope.goToPlaylist = function () {
        var link = "/playlist/" + $scope.playlist.recordId;
        if ($scope.hubId) {
            link += "?hubId=" + $scope.hubId;
        }
        $location.url(link);
    };

    $scope.init();
}]);
var app = angular.module("dsaApp");

app.controller("preferencesController", ["$scope", "$location", "remotingService", "sessionService", function ($scope, $location, remotingService, sessionService) {
    $scope.templates = {
        menu: resourceUrl + "/partials/preferences-menu.html"
    };
    $scope.languages = [
		{
		    name: "English",
		    value: "en_US",
		    isSelected: false
		},
		{
		    name: "Japanese",
		    value: "ja",
		    isSelected: false
		}
    ];
    $scope.macs = [];
    $scope.macSelected = false;

    $scope.init = function () {
        if ($scope.info && $scope.info.user) {
            if (!$scope.info.user.isContentUser) {
                $location.url("/error/" + $scope.info.contentUserErrorMessage);
            }
            if ($scope.macSelected) {
                $location.url("/");
            }
        }
        $scope.getMobileAppConfigs();
    };

    $scope.getMobileAppConfigs = function () {
        remotingService.execute(
			"DSARemoterMobileAppConfigExtension.getMobileAppConfigurations",
			{
			    success: function (result) {
			        $scope.macs = result;
			        $scope.checkForSelectedMac();
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.checkForSelectedMac = function () {
        _.each($scope.macs, function (mac) {
            mac.isSelected = mac.mobileAppConfigId == $scope.info.preferredMobileAppConfiguration;
        });
    };

    $scope.selectMac = function (mac) {
        var previousSelectBool = mac.isSelected;
        mac.isSelected = !mac.isSelected;
        var arr = _.where($scope.macs, { isSelected: true });
        if (arr.length > 1) {
            if (mac.isSelected) {
                _.each($scope.macs, function (m) {
                    if (m.mobileAppConfigId !== mac.mobileAppConfigId) {
                        m.isSelected = false;
                    }
                });
            }
        } else if (arr.length == 0) {
            mac.isSelected = !mac.isSelected;
        }
        if (mac.isSelected != previousSelectBool) {
            $scope.macSelected = true;
            remotingService.execute(
				"DSARemoterInfoExtension.setPreferredMobileAppConfiguration",
				mac.mobileAppConfigId,
				{
				    success: function (result) {
				        $scope.info.preferredMobileAppConfiguration = mac.mobileAppConfigId;
				        $scope.$emit("infoUpdate-emit", $scope.info, mac.titleText);
				    },
				    error: function (error) {
				        $scope.stopLoading();
				        sessionService.checkSession(error.message);
				    }
				},
				$scope
			);
        }
    };

    $scope.selectLanguage = function (language) {
        language.isSelected = !language.isSelected;
        var selectedLanguages = _.where($scope.languages, { isSelected: true });
        var languageValues = _.pluck(selectedLanguages, "value");
        remotingService.execute(
			"DSARemoterInfoExtension.setPreferredLanguageCodes",
			languageValues,
			{
			    success: function (result) {
			        $scope.$emit("refreshPage");
			    },
			    error: function (error) {
			        $scope.stopLoading();
			        sessionService.checkSession(error.message);
			    }
			},
			$scope
		);
    };

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
        $scope.init();
    });



    $scope.navigateToSF = function () {
        if (window.sforce && window.sforce.one) {
            window.sforce.one.back();
        } else {
            window.location.href = location.protocol + '//' + location.hostname + '/home/home.jsp';
        }
    }

}]);
var app = angular.module("dsaApp");

app.controller("searchController", ["$scope", "$location", "$timeout", function ($scope, $location, $timeout) {
    $scope.searchIconClass = "fa-search";
    //$scope.searchResults = [];

    /*$scope.search = function() {
		remotingService.execute(
			"DSARemoterSearchExtension.search",
			$scope.searchTerm, false,
			{
				success: function(result) {
					$scope.handleSearchResults(result);
				}
			},
			$scope
		);
	};*/

    /*$scope.handleSearchResults = function(result) {
		var searchResults = [];
		if (result) {
			_.each(result.hubs, function(obj, index, collection) {
				obj.obj_type = 'hub';
				searchResults.push(obj);
			});
			_.each(result.playlists, function(obj, index, collection) {
				obj.obj_type = 'playlist';
				searchResults.push(obj);
			});
			_.each(result.contentItems, function(obj, index, collection) {
				obj.obj_type = 'contentItem';
				obj.name = obj.title;
				searchResults.push(obj);
			});
			$scope.searchResults = _.sortBy(searchResults, "name");
		}
		if (searchResults.length > 0) {
			$scope.expandSearchResults();
		} else {
			$scope.closeSearchResults();
		}
	};*/

    $scope.$on("searchCompleted-broadcast", function () {
        $scope.searchIconClass = "fa-search";
    });

    $scope.handleSearchTermChange = function () {
        if (!($scope.searchTerm && $scope.searchTerm.length > 0)) {
            $scope.searchIconClass = "fa-times-circle";
            /*if ($scope.searchTerm.length > 2) {
				$scope.search();
			} else {
				$scope.closeSearchResults();
			}*/
        } else {
            $scope.searchIconClass = "fa-search";
            //$scope.closeSearchResults();
        }
    };

    $scope.clearSearch = function () {//debugger;
        //$scope.searchResultsExpanded = false;
        if (!($scope.searchTerm) || ($scope.searchTerm && $scope.searchTerm.length == 0)) {
            $scope.searchTerm = '';
            $(".navbar-search input").blur();
            // $scope.handleSearchTermChange();
        }
        else {
            $scope.goToResult();
            // $scope.searchIconClass = "fa-times-circle";
        }
    };

    $scope.hideKeyword = function () {//debugger;
        // console.log("SFDC");
        $('body').on('click', function (event) {
            document.activeElement.blur();
            // console.log("blur");
        });

        $('input').click(function (event) {
            event.stopPropagation();
        });
    };


    /*$scope.expandSearchResults = function() {
		if ($scope.searchResultsExpanded !== true) {
			$("#navbar-search-results-wrapper").css({
				"position":"absolute",
				backgroundColor:"#1e2021",
				left: "0px",
				width:"100%",
				"z-index":"100000"
			});
			$("#navbar-search-results-wrapper .section-list").show();
			$("#navbar-search-results-wrapper").animate({
				height:"100%"
			});
			$scope.searchResultsExpanded = true;
		}
	};*/

    /*$scope.closeSearchResults = function() {
		$scope.searchResultsExpanded = false;
		$("#navbar-search-results-wrapper").animate({
			height:"0px"
		});
		$("#navbar-search-results-wrapper").css({
			overflowY:"hidden"
		});
	};*/

    $scope.goToResult = function () {//debugger;
        $scope.searchIconClass = "fa-spinner fa-spin";
        $location.url('/searchResults/' + $scope.searchTerm);
        /*var link = '#';
		if (this.searchResult) {
			switch (this.searchResult.obj_type) {
				case "hub":
					link = '#/hubs/' + this.searchResult.recordId;
					break;
				case "playlist":
					link = '#/playlist/' + this.searchResult.recordId;
					break;
				case "contentItem":
					link = '#/content/' + this.searchResult.recordId;
					break;
			}
		}
		window.location = link;*/
        //document.activeElement.blur();
        //$("input").blur();
        $('input').focus();

        if ($scope.mobile) {
            $scope.resizeNavbarCollapseHeight();
            var navBarToggle = angular.element($(".navbar-toggle"))
            $timeout(function () {
                navBarToggle.trigger("click");
            }, 10);
        }
        $('body').off('click');
    };
}]);
var app = angular.module("dsaApp");

app.controller("searchResultsController", ["$scope", "$routeParams", "$location", "$window", "remotingService", function ($scope, $routeParams, $location, $window, remotingService) {
    $scope.searchIconClass = "fa-spinner fa-spin";
    $scope.searchTerm = $routeParams.searchTerm;
    $scope.searchResults = [];
    $scope.searchTermLabel = $scope.searchTerm;
    $scope.filterIcon = "s1utility s1utility-filter";
    $scope.tags = [];
    $scope.filteredResultLists = [];
    $scope.filterHeight = $window.innerHeight - 80 - 31;
    $scope.searchErrorMessage = "";

    if ($scope.info && $scope.info.user) {
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    }

    $scope.expandPath = function(){
        debugger;
            $("#breadcrumbs li")
              .not(":first-child")
              .not(":last-child")
              .not("#button")
              .toggle(50);
    };

    $scope.setPath = function () {
            $("#breadcrumbs li")
              .not(":first-child")
              .not(":last-child")
              .not("#button")
              .hide();
    }

    $scope.$on("internalOnlyMode-broadcast", function (event, internalOnlyMode) {
        $scope.internalOnlyMode = internalOnlyMode;
        $scope.search();
    });

    $scope.$on("refreshPage-broadcast", function () {
        $scope.init();
    });

    $scope.$on("infoUpdate", function (event, info) {
        $scope.info = info;
        if (!$scope.info.user.isContentUser) {
            $location.url("/error/" + $scope.info.contentUserErrorMessage);
        }
    });

    $scope.search = function () {
        $scope.startLoading();
        if ($scope.searchTerm) {
            remotingService.execute(
				"DSARemoterSearchExtension.search",
				$scope.searchTerm,
				{
				    success: function (result) {
				        $scope.stopLoading();
				        $scope.searchErrorMessage = "";
				        $scope.handleSearchResults(result);
				        $scope.searchIconClass = "fa-search";
				        $scope.$emit("searchCompleted");
				    },
				    error: function (message) {
				        $scope.stopLoading();
				        $scope.searchIconClass = "fa-search";
				        $scope.$emit("searchCompleted");
				        $scope.searchErrorMessage = "Please try again; consider a search term likely to return fewer results.";
				    }
				},
				$scope
			);
        }
    };

    $scope.handleSearchResults = function (result) {
        var searchResults = [];
        var tagSet = {};
        if (result) {
            _.each(result.categories, function (obj, index, collection) {
                obj.obj_type = 'category';
                searchResults.push(obj);
                _.each(obj.tags, function (tag) {
                    tagSet[tag] = {
                        name: tag,
                        isChecked: false
                    };
                });
            });
            _.each(result.playlists, function (obj, index, collection) {
                obj.obj_type = 'playlist';
                searchResults.push(obj);
                _.each(obj.tags, function (tag) {
                    tagSet[tag] = {
                        name: tag,
                        isChecked: false
                    };
                });
            });
            _.each(result.contentItemDetails, function (obj, index, collection) {
                obj.obj_type = 'contentItem';
                obj.name = obj.title;
                searchResults.push(obj);
                _.each(obj.tags, function (tag) {
                    tagSet[tag] = {
                        name: tag,
                        isChecked: false
                    };
                });
            });
            $scope.tags = _.sortBy(_.values(tagSet, "tag"), "name");
            $scope.searchResults = _.sortBy(searchResults, "name");
        }
    };

    $scope.search();

    $scope.belongsToCategories = function (value) {
        return value.obj_type == 'category';
    };

    $scope.belongsToAllResults = function (value) {
        return value.obj_type != 'category';
    };

    $scope.filterResults = function (selectedTag) {
        if (selectedTag) {
            selectedTag.isChecked = !selectedTag.isChecked;
        }
        $scope.filteredResultLists = [];
        var resultMap = {
            all_tags: {
                label: "",
                results: []
            }
        };
        var selectedTags = [];
        _.each($scope.tags, function (tag) {
            if (tag.isChecked) {
                selectedTags.push(tag.name);
            }
        });
        resultMap.all_tags.label = selectedTags.join(" + ");
        _.each($scope.searchResults, function (searchResult) {
            var intersection = _.intersection(selectedTags, searchResult.tags);
            if (selectedTags.length === intersection.length) {
                resultMap.all_tags.results.push(searchResult);
            }
            _.each(intersection, function (tag) {
                if (!resultMap[tag]) {
                    resultMap[tag] = {
                        label: tag,
                        results: []
                    };
                }
                resultMap[tag].results.push(searchResult);
            });
        });
        var resultLists = _.values(resultMap);
        if (resultLists.length == 1) {
            $scope.filteredResultLists = [];
        } else if (resultLists.length == 2) {
            $scope.filteredResultLists.push(resultLists[0]);
        } else {
            _.each(resultLists, function (list) {
                $scope.filteredResultLists.push(list);
            });
        }
    };



    $scope.slideFilter = function () {
        $scope.filterIcon = $scope.filterIcon === "s1utility s1utility-filter" ? "fa fa-chevron-up" : "s1utility s1utility-filter";
        if ($scope.mobile) {
            $("#filter-results-section").css({
                height: $scope.filterHeight
            });
        }
        $("#filter-results-section").slideToggle();
    };

    $scope.applyFilter = function () {
        if ($scope.filteredResultLists.length > 0) {
            $scope.slideFilter();
        }
    };

    $scope.clearFilter = function () {
        if ($scope.filteredResultLists.length > 0) {
            _.each($scope.tags, function (tag) {
                tag.isChecked = false;
            });
            $scope.filterResults();
        }
    };

    $scope.determineResultWidth = function () {
        $scope.resultWidth = $scope.desktop ? Math.floor(($scope.searchResultsScreenWidth - 21 - (20 * 6)) / 3) + "px" : "100%";
    };

    $scope.determineRelatedCategoryWidth = function () {
        $scope.relatedCategoryWidth = Math.floor(($scope.searchResultsScreenWidth - 21 - (20 * 6)) / 5);
        $scope.relatedCategoryHeight = Math.floor(200 * $scope.relatedCategoryWidth / 280);
    };

    $scope.goToItemDetail = function () {
        var link = '/';
        if (this.searchResult) {
            switch (this.searchResult.obj_type) {
                case "category":
                    link = '/category/' + this.searchResult.categoryId;
                    break;
                case "playlist":
                    link = '/playlist/' + this.searchResult.categoryId;
                    break;
                case "contentItem":
                    link = '/content/' + this.searchResult.contentDocumentId;
                    break;
            }
        }
        $location.url(link);
    };


    $scope.clearSearch = function () {
        //$scope.searchResultsExpanded = false;
        //debugger;
        if (!$scope.searchTerm) {
            $scope.searchTerm = '';
            $(".navbar-search input").blur();
            //$scope.handleSearchTermChange();
        }
        else {
            $scope.goToResult();
            // $scope.searchIconClass = "fa-times-circle";
        }
    };

    $scope.hideKeyword = function () {
        //debugger;
        // console.log("SFDC");
        $('body').on('click', function (event) {
            //document.activeElement.blur();
            // console.log("blur");
        });

        $('input').click(function (event) {
            //event.stopPropagation();
        });
    };

    $scope.goToResult = function () {//debugger;
        $scope.searchIconClass = "fa-spinner fa-spin";
        //document.activeElement.blur();
        //$("input").blur();
        $location.url('/searchResults/' + $scope.searchTerm);
        $("input").focus();
        // $scope.searchIconClass = "fa-spinner fa-spin";
        // $location.url('/searchResults/' + $scope.searchTerm);
        // if ($scope.mobile) {
        // 	$scope.resizeNavbarCollapseHeight();
        // 	var navBarToggle = angular.element($(".navbar-toggle"))
        //     $timeout(function () {
        //       navBarToggle.trigger("click");
        //     }, 10);
        // }
        // $('body').off('click');
    };

    // $scope.onresize = $window.parent.onresize;
    // $window.parent.onresize = function() {
    // 	$scope.onresize();
    // 	$scope.resultsScreenHeight = $window.innerHeight;
    // 	$scope.determineResultWidth();
    // 	$scope.determineRelatedCategoryWidth();
    // 	if (!$scope.$$phase) {
    // 		$scope.$apply();
    // 	}
    // };
    // $window.parent.onresize();

    $scope.onresize = $window.onresize;
    $window.onresize = function () {
        $scope.onresize();
        $scope.desktop = $window.innerWidth >= 768;
        $scope.mobile = $window.innerWidth < 768;
        $scope.resultsScreenHeight = $window.innerHeight;
        $scope.searchResultsScreenWidth = $window.innerWidth;
        $scope.determineResultWidth();
        $scope.determineRelatedCategoryWidth();
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $window.onresize();
}]);
var app = angular.module("dsaApp");

app.directive('expandCategoryList', ["$window", function ($window) {
    return {
        restrict: 'C',
        link: function ($scope, element, attrs) {

            $scope.$on("expandCategoryList2", function () {
                $scope.displayCategoryListClose = true;
                $(element).css({
                    display: "block"
                });
                $scope.categoryListTop = $(element).position().top;
                $(element).css({
                    display: "block",
                    "position": "fixed",
                    backgroundColor: "#1e2021",
                    width: "100%",
                    height: $window.innerHeight + "px",
                    "z-index": "2000000",
                    top: $scope.categoryListTop,
                    left: 0
                });
                $(element).animate({
                    top: 0
                });
            });

            $scope.$on("closeCategoryList2", function () {
                if ($scope.mobile) {
                    $scope.displayCategoryListClose = false;
                    $(element).animate({
                        top: $scope.categoryListTop
                    }, function () {
                        $(this).removeAttr("style");
                    });
                    $scope.$emit('displayCategoryListCloseFalse');
                }
            });
        }
    }
}]);
var app = angular.module("dsaApp");

app.directive('expandContentList', ["$window", function ($window) {
    return {
        restrict: 'C',
        link: function ($scope, element, attrs) {

            $scope.$on("expandContentList2", function () {
                $scope.displayContentListClose = true;
                $(element).css({
                    display: "block"
                });
                $scope.contentListTop = $(element).position().top;
                $(element).css({
                    display: "block",
                    "position": "fixed",
                    backgroundColor: "#1e2021",
                    width: "100%",
                    height: $window.innerHeight + "px",
                    "z-index": "2000000",
                    top: $scope.contentListTop,
                    left: 0
                });
                $(element).animate({
                    top: 0
                });
            });

            $scope.$on("closeContentList2", function () {
                if ($scope.mobile) {
                    $scope.displayContentListClose = false;
                    $(element).animate({
                        top: $scope.contentListTop
                    }, function () {
                        $(this).removeAttr("style");
                    });
                    $scope.$emit('displayContentListCloseFalse');
                }
            });
        }
    }
}]);
var app = angular.module("dsaApp");

app.directive('expandHubList', ["$window", function ($window) {
    return {
        restrict: 'C',
        link: function ($scope, element, attrs) {

            $scope.$on("expandHubList2", function () {
                $scope.displayHubListClose = true;
                $(element).css({
                    display: "block"
                });
                $scope.hubListTop = $(element).position().top;
                $(element).css({
                    display: "block",
                    "position": "fixed",
                    backgroundColor: "#1e2021",
                    width: "100%",
                    height: $window.innerHeight + "px",
                    "z-index": "2000000",
                    top: $scope.hubListTop,
                    left: 0
                });
                $(element).animate({
                    top: 0
                });
            });

            $scope.$on("closeHubList2", function () {
                if ($scope.mobile) {
                    $scope.displayHubListClose = false;
                    $(element).animate({
                        top: $scope.hubListTop
                    }, function () {
                        $(this).removeAttr("style");
                    });
                    $scope.$emit('displayHubListCloseFalse');
                }
            });
        }
    }
}]);
var app = angular.module("dsaApp");

app.directive('expandPlaylistList', ["$window", function ($window) {
    return {
        restrict: 'C',
        link: function ($scope, element, attrs) {

            $scope.$on("expandPlaylistList2", function () {
                $scope.displayPlaylistListClose = true;
                $(element).css({
                    display: "block"
                });
                $scope.playlistListTop = $(element).position().top;
                $(element).css({
                    display: "block",
                    "position": "fixed",
                    backgroundColor: "#1e2021",
                    width: "100%",
                    height: $window.innerHeight + "px",
                    "z-index": "2000000",
                    top: $scope.playlistListTop,
                    left: 0
                });
                $(element).animate({
                    top: 0
                });
            });

            $scope.$on("closePlaylistList2", function () {
                if ($scope.mobile) {
                    $scope.displayPlaylistListClose = false;
                    $(element).animate({
                        top: $scope.playlistListTop
                    }, function () {
                        $(this).removeAttr("style");
                    });
                    $scope.$emit('displayPlaylistListCloseFalse');
                }
            });
        }
    }
}]);
var app = angular.module("dsaApp");

app.directive('playlistHeight', ["$window", "$timeout", function ($window, $timeout) {
    return {
        restrict: 'C',
        link: function ($scope, element, attrs) {
            var playlistResize = function () {
                if ($scope.desktop) {
                    var tallest = 0;
                    var group = $(".playlist-height");
                    group.each(function () {
                        var myHeight = $(this).height();
                        tallest = myHeight > tallest ? myHeight : tallest;
                    });
                    group.height(tallest);
                } else {
                    $(element).removeAttr("style");
                }
            };

            $timeout(playlistResize, 0);

            // var windowResize = $window.parent.onresize;
            // $window.parent.onresize = function() {
            // 	windowResize();
            // 	playlistResize();
            // };

            var windowResize = $window.onresize;
            $window.onresize = function () {
                windowResize();
                playlistResize();
            };
        }
    }
}]);
var app = angular.module('dsaApp');

app.directive('uiSwitch', ['$window', '$timeout', '$parse', function ($window, $timeout, $parse) {

    /**
     * Initializes the HTML element as a Switchery switch.
     *
     * $timeout is in place as a workaround to work within angular-ui tabs.
     *
     * @param scope
     * @param elem
     * @param attrs
     */
    function linkSwitchery(scope, elem, attrs) {
        var options = {};
        try {
            options = $parse(attrs.uiSwitch)(scope);
        }
        catch (e) { }

        $timeout(function () {
            var init = new $window.Switchery(elem[0], options);
            if (attrs.ngModel) {
                scope.$watch(attrs.ngModel, function () {
                    init.setPosition(false);
                });
            }
            $(elem).on("change", function () {
                var internalOnlyMode = $(elem).filter(":checked").length > 0;
                scope.$emit("internalOnlyMode", internalOnlyMode);
            });
        }, 0);
    }
    return {
        restrict: 'AE',
        link: linkSwitchery
    }
}]);
var app = angular.module('dsaApp');

app.directive('droppable', function () {
    return {
        scope: {
            drop: '&' // parent
        },
        link: function (scope, element) {
            // again we need the native object
            var el = element[0];

            el.addEventListener(
				'dragover',
				function (e) {
				    e.dataTransfer.dropEffect = 'move';
				    // allows us to drop
				    if (e.preventDefault) e.preventDefault();
				    this.classList.add('over');
				    return false;
				},
				false
			);
            el.addEventListener(
				'dragenter',
				function (e) {
				    this.classList.add('over');
				    return false;
				},
				false
			);

            el.addEventListener(
				'dragleave',
				function (e) {
				    this.classList.remove('over');
				    return false;
				},
				false
			);
            el.addEventListener(
				'drop',
				function (e) {
				    // Stops some browsers from redirecting.
				    if (e.stopPropagation) e.stopPropagation();
				    this.classList.remove('over');
				    e.preventDefault();

				    scope.$parent.handleDrop(e);

				    return false;
				},
				false
			);
            el.addEventListener(
				'change',
				function (e) {
				    // Stops some browsers from redirecting.
				    if (e.stopPropagation) e.stopPropagation();
				    e.preventDefault();
				    this.classList.remove('over');

				    //scope.$apply('drop()');
				    scope.$parent.handleChange(e);

				    return false;
				},
				false
			);
        }
    }
});
var app = angular.module('dsaApp');

app.directive('onFileChange', function () {
    return {
        scope: {},
        link: function (scope, element) {
            // again we need the native object
            var el = element[0];

            el.addEventListener(
				'change',
				function (e) {
				    // Stops some browsers from redirecting.
				    if (e.stopPropagation) e.stopPropagation();
				    e.preventDefault();
				    this.classList.remove('over');

				    //scope.$apply('drop()');
				    scope.$parent.handleChange(e);

				    return false;
				},
				false
			);
        }
    }
});
var app = angular.module('dsaApp');

app.filter("ellipseText", function () {
    return function (input) {
        var ret = input;
        if (ret && ret.length > 160) {
            ret = ret.substring(0, 160 - 3) + "...";
        }
        return ret;
    };
});

app.filter("ellipseText22", function () {
    return function (input) {
        var ret = input;
        if (ret && ret.length > 22) {
            ret = ret.substring(0, 22 - 3) + "...";
        }
        return ret;
    };
});
var app = angular.module('dsaApp');

app.filter('fileIconClass', function () {
    var fileTypeToClass = {
        "ai": "ai", "ps": "ai", "svg": "ai", //ai
        "aif": "audio", "iff": "audio", "m3u": "audio", "m4a": "audio", "mid": "audio", "mp3": "audio", "mpa": "audio", "ra": "audio", "wav": "audio", "wma": "audio", //audio
        "csv": "csv", //csv
        "eps": "eps", //eps
        "xlr": "excel", "xls": "excel", "xlsx": "excel", //excel
        "apk": "exe", "app": "exe", "bat": "exe", "cgi": "exe", "com": "exe", "exe": "exe", "gadget": "exe", "jar": "exe", "pif": "exe", "vb": "exe", "wsf": "exe", //exe
        "flv": "flash", //flash
        "gdoc": "gdoc", //gdoc
        "gpres": "gpres", //gpres
        "gsheet": "gsheet", //gsheet
        "asp": "html", "aspx": "html", "cer": "html", "cfm": "html", "csr": "html", "css": "html", "htm": "html", "html": "html", "js": "html", "jsp": "html", "php": "html", "rss": "html", "xhtml": "html", //html
        "bmp": "image", "dds": "image", "gif": "image", "jpg": "image", "png": "image", "pspimage": "image", "tga": "image", "thm": "image", "tif": "image", "tiff": "image", "yuv": "image", //image
        "key": "keynote", //keynote
        "link": "link", //link
        "mp4": "mp4", //mp4
        "overlay": "overlay", //overlay
        "pkg": "pack", "msi": "pack", "dmg": "pack", "iso": "pack", //pack
        "pages": "pages", //pages
        "pdf": "pdf", //pdf
        "pps": "ppt", "ppt": "ppt", "pptx": "ppt", //ppt
        "psd": "psd", //psd
        "rtf": "rtf", //rtf
        "slide": "slide", //slide
        "stypi": "stypi", //stypi
        "txt": "txt", //txt
        "unknown": "unknown", //unknown
        "3g2": "video", "3gp": "video", "asf": "video", "asx": "video", "avi": "video", "m4v": "video", "mov": "video", "mpg": "video", "rm": "video", "srt": "video", "swf": "video", "vob": "video", "wmv": "video", //video
        "visio": "visio", //visio
        "webex": "webex",
        "doc": "word", "docx": "word", "wpd": "word", "wps": "word", //word
        "xml": "xml", //xml
        "7z": "zip", "cbr": "zip", "deb": "zip", "gz": "zip", "rar": "zip", "rpm": "zip", "sitx": "zip", "tar.gz": "zip", "zip": "zip", "zipx": "zip" //zip
    };
    return function (input) {
        if (input) {
            if (input.indexOf(".") != -1) {
                input = input.split(".")[1];
            }
        } else {
            input = 'unknown';
        }
        input = input.toLowerCase();
        return fileTypeToClass[input];
    };
});
var app = angular.module("dsaApp");

app.filter("searchResultLink", function () {
    return function (searchResult) {
        var link = '#';
        if (searchResult) {
            switch (searchResult.obj_type) {
                case "hub":
                    link = '#/hubs/' + searchResult.recordId;
                    break;
                case "playlist":
                    link = '#/playlist/' + searchResult.recordId;
                    break;
                case "contentItem":
                    link = '#/content/' + searchResult.recordId;
                    break;
            }
        }
        return link;
    };
});
var app = angular.module('dsaApp');

app.filter('sfdcMonthDateYear', function () {
    return function (input) {
        var dateString = '';
        var monthNames = [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        if (input) {
            var convertedDate = new Date(input);
            dateString = monthNames[convertedDate.getUTCMonth()] + ' ' + convertedDate.getUTCDate() + ', ' + convertedDate.getUTCFullYear();
        }
        return dateString;
    };
});

app.filter('sfdcMonthDateYearTime', function () {
    return function (input) {
        var dateString = '';
        var monthNames = [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        if (input) {
            var convertedDate = new Date(input);
            dateString = monthNames[convertedDate.getUTCMonth()] + ' ' + convertedDate.getUTCDate() + ', ' + convertedDate.getUTCFullYear();
            dateString += " at ";
            var hour = convertedDate.getHours();
            var amPM = "AM";
            if (hour > 11) {
                amPM = "PM"
            }
            if (hour == 0 || hour > 12) {
                hour = Math.abs(hour - 12);
            }
            dateString += hour + ":" + convertedDate.getMinutes() + " " + amPM;
        }
        return dateString;
    };
});
var app = angular.module("dsaApp");

app.service("remotingService", ["$q", "$rootScope", "Stub", function ($q, $rootScope, Stub) {
    this.execute = function () {

        var args, callback, escapeResults, options, remotedFunction, scope, _i;
        var __slice = [].slice;
        remotedFunction = this.determineMethod(arguments[0]),
	    args = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 2) : (_i = 1, []),
	    options = arguments[_i++],
	    scope = arguments[_i++];
        var success = options.success;
        if (!options.success) {
            throw new Error("A success callback is required for this method.");
        }
        var error = options.error;
        if (!error) {
            error = function (error) {
                throw new Error(error.message);
            };
        }
        success = _.bind(success, scope);
        error = _.bind(error, scope);

        var remotedFunctionReq = function () {
            var deferred = $q.defer();

            callback = function (result, event) {
                if (!$rootScope.$$phase) {
                    $rootScope.$apply(function () {
                        if (event.status) {
                            deferred.resolve(result);
                        }
                        else {
                            deferred.reject(event);
                        }
                    });
                } else {
                    if (event.status) {
                        deferred.resolve(result);
                    }
                    else {
                        deferred.reject(event);
                    }
                }
            };

            escapeResults = options.escape;
            if (typeof escapeResults == "undefined") {
                escapeResults = false;
            }
            args.push(callback);
            options = {
                escape: escapeResults
            };
            args.push(options);

            remotedFunction.apply(scope, args);

            return deferred.promise;
        };
        var handleSuccess = this.handleSuccess;
        return remotedFunctionReq().then(
	    	function (result) {
	    	    success(result);
	    	}, function (event) {
	    	    error(event);
	    	});
    };

    this.determineMethod = function (remotedFunction) {
        if (packageName === "{!packageName}") {
            packageName = "";
        }
        var methodArray = remotedFunction.split(".");
        var method;
        if (packageName && window[packageName] && window[packageName][methodArray[0]]) {
            method = window[packageName][methodArray[0]][methodArray[1]];
        } else if (window[methodArray[0]]) {
            method = window[methodArray[0]][methodArray[1]];
        } else if (window.HoaKula && window.HoaKula[methodArray[0]]) {
            method = window.HoaKula[methodArray[0]][methodArray[1]];
        } else {
            method = Stub.getStub(methodArray[0])[methodArray[1]];
        }
        return method;
    };
}]);
var app = angular.module("dsaApp");

app.service("sessionService", ["$location", "remotingService", function ($location, remotingService) {
    this.checkSession = function (errorMessage) {
        remotingService.execute(
			"DSARemoter.checkSession",
			{
			    success: function (result) {
			        $location.url("/error/" + errorMessage);
			    },
			    error: function (error) {
			        location.reload(true);
			    }
			},
			this
		);
    };
}]);
var app = angular.module("dsaApp");

app.factory("Stub", ["DSARemoterHubExtensionStub",
					"DSARemoterContentItemExtensionStub",
					"DSARemoterSearchExtensionStub",
					"DSARemoterPlaylistExtensionStub",
					"DSARemoterInfoExtensionStub",
					"DSARemoterMobileAppConfigExtensionStub",
					"DSARemoterCategoryExtensionStub",
					function (DSARemoterHubExtensionStub,
							DSARemoterContentItemExtensionStub,
							DSARemoterSearchExtensionStub,
							DSARemoterPlaylistExtensionStub,
							DSARemoterInfoExtensionStub,
							DSARemoterMobileAppConfigExtensionStub,
							DSARemoterCategoryExtensionStub) {
					    var stubControllers = {
					        "DSARemoterHubExtension": DSARemoterHubExtensionStub,
					        "DSARemoterContentItemExtension": DSARemoterContentItemExtensionStub,
					        "DSARemoterSearchExtension": DSARemoterSearchExtensionStub,
					        "DSARemoterPlaylistExtension": DSARemoterPlaylistExtensionStub,
					        "DSARemoterInfoExtension": DSARemoterInfoExtensionStub,
					        "DSARemoterMobileAppConfigExtension": DSARemoterMobileAppConfigExtensionStub,
					        "DSARemoterCategoryExtension": DSARemoterCategoryExtensionStub
					    };

					    function getStub(apexControllerName) {
					        return stubControllers[apexControllerName];
					    }

					    return {
					        getStub: getStub
					    };
					}]);
var app = angular.module("dsaApp");

app.factory("DSARemoterCategoryExtensionStub", function () {
    function getTopLevelCategories(mobileConfigId, callback, options) {
        callback(
			[
				{
				    "categoryId": "0123456789012341",
				    "name": "Getting Started",
				    "isTopLevel": true,
				    "isParent": true,
				    "landscapeImageURL": "images/market-bg2-hi.jpg",
				    "portraitImageURL": "images/market-bg2-hi.jpg",
				    "languageCode": "",
				    "iconImageURL": "images/Default-Category-Avatar.png"
				},
				{
				    "categoryId": "0123456789012342",
				    "name": "Dreamforce",
				    "isTopLevel": true,
				    "isParent": true,
				    "landscapeImageURL": "images/customize-bg-hi.jpg",
				    "portraitImageURL": "images/customize-bg-hi.jpg",
				    "languageCode": "",
				    "iconImageURL": "images/Default-Category-Avatar.png"
				},
				{
				    "categoryId": "0123456789012343",
				    "name": "Salesforce1",
				    "isTopLevel": true,
				    "isParent": true,
				    "landscapeImageURL": "images/sell-bg1-hi.jpg",
				    "portraitImageURL": "images/sell-bg1-hi.jpg",
				    "languageCode": "",
				    "iconImageURL": "images/Default-Category-Avatar.png"
				},
				{
				    "categoryId": "0123456789012344",
				    "name": "Sales Cloud",
				    "isTopLevel": true,
				    "isParent": true,
				    "landscapeImageURL": "images/sell-bg2-hi.jpg",
				    "portraitImageURL": "images/sell-bg2-hi.jpg",
				    "languageCode": "",
				    "iconImageURL": "images/Default-Category-Avatar.png"
				},
				{
				    "categoryId": "0123456789012345",
				    "name": "Marketing Cloud",
				    "isTopLevel": true,
				    "isParent": true,
				    "landscapeImageURL": "images/service-bg1-hi.jpg",
				    "portraitImageURL": "images/service-bg1-hi.jpg",
				    "languageCode": "",
				    "iconImageURL": "images/Default-Category-Avatar.png"
				},
				{
				    "categoryId": "0123456789012346",
				    "name": "Service Cloud",
				    "isTopLevel": true,
				    "isParent": true,
				    "landscapeImageURL": "images/service-bg2-hi.jpg",
				    "portraitImageURL": "images/service-bg2-hi.jpg",
				    "languageCode": "",
				    "iconImageURL": "images/Default-Category-Avatar.png"
				}
			],
			{
			    status: true
			}
		);
    }

    function getCategory(categoryId, callback, options) {
        callback(
			{
			    "categoryId": "0123456789012344",
			    "name": "Sales Cloud",
			    "isTopLevel": true,
			    "isParent": true,
			    "iconImageURL": "images/Default-Category-Avatar.png",
			    "landscapeImageURL": "images/sell-bg2-hi.jpg",
			    "portraitImageURL": "images/sell-bg2-hi.jpg"
			},
			{
			    status: true
			}
		);
    }

    function getCategoryDetail(categoryId, callback, options) {
        callback(
			{
			    "categoryId": "0123456789012344",
			    "name": "Sales Cloud",
			    "isTopLevel": false,
			    "isParent": true,
			    "landscapeImageURL": "images/sell-bg2-hi.jpg",
			    "portraitImageURL": "images/sell-bg2-hi.jpg",
			    "languageCode": "",
			    "iconImageURL": "images/Default-Category-Avatar.png",
			    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lectus leo elementum non sollicitudin vitae, pellentesque in leo. Nullam a eros aliquet dolor consequat viverra.",
			    "contentItems": [
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": ".mov",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "mpg",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "wmv",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "jpg",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "png",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "gif",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "xls",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "ppt",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "xlsx",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": ".mov",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "mpg",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "wmv",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "jpg",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "png",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "gif",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "xls",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "ppt",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "xlsx",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": ".mov",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "mpg",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "wmv",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "jpg",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "png",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "gif",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "xls",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "ppt",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Lorem ipsum dolor sit amet",
					    "fileExtension": "xlsx",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					}
			    ]
			},
			{
			    status: true
			}
		);
    }

    function getSubCategories(categoryId, callback, options) {
        callback(
			[
				{
				    "categoryId": "0123456789012301",
				    "name": "Data.com",
				    "isTopLevel": false,
				    "isParent": false,
				    "landscapeImageURL": "images/market-bg2-hi.jpg",
				    "portraitImageURL": "images/market-bg2-hi.jpg",
				    "languageCode": "",
				    "iconImageURL": "images/Default-Category-Avatar.png"
				},
				{
				    "categoryId": "0123456789012302",
				    "name": "Work.com",
				    "isTopLevel": false,
				    "isParent": false,
				    "landscapeImageURL": "images/sell-bg1-hi.jpg",
				    "portraitImageURL": "images/sell-bg1-hi.jpg",
				    "languageCode": "",
				    "iconImageURL": "images/Default-Category-Avatar.png"
				},
				{
				    "categoryId": "0123456789012303",
				    "name": "Pardot",
				    "isTopLevel": false,
				    "isParent": false,
				    "landscapeImageURL": "images/sell-bg2-hi.jpg",
				    "portraitImageURL": "images/sell-bg2-hi.jpg",
				    "languageCode": "",
				    "iconImageURL": "images/Default-Category-Avatar.png"
				},
				{
				    "categoryId": "0123456789012304",
				    "name": "Sales Performance Accelerator",
				    "isTopLevel": false,
				    "isParent": false,
				    "landscapeImageURL": "images/service-bg1-hi.jpg",
				    "portraitImageURL": "images/service-bg1-hi.jpg",
				    "languageCode": "",
				    "iconImageURL": "images/Default-Category-Avatar.png"
				},
				{
				    "categoryId": "0123456789012305",
				    "name": "Dreamforce",
				    "isTopLevel": false,
				    "isParent": false,
				    "landscapeImageURL": "images/customize-bg-hi.jpg",
				    "portraitImageURL": "images/customize-bg-hi.jpg",
				    "languageCode": "",
				    "iconImageURL": "images/Default-Category-Avatar.png"
				}
			],
			{
			    status: true
			}
		);
    }

    function getParentCategory(childCategoryId, callback, options) {
        callback(
			{
			    "categoryId": "0123456789012341",
			    "name": "Getting Started",
			    "isTopLevel": true,
			    "isParent": true,
			    "landscapeImageURL": "images/market-bg2-hi.jpg",
			    "portraitImageURL": "images/market-bg2-hi.jpg",
			    "languageCode": "",
			    "iconImageURL": "images/Default-Category-Avatar.png"
			},
			{
			    status: true
			}
		);
    }

    function getRelatedContent(categoryId, callback, options) {
        callback(
			[
				{
				    "title": "Lorem ipsum dolor sit amet",
				    "fileExtension": "wmv",
				    "recordId": "0123456789012303",
				    "contentDocumentId": "123"
				},
				{
				    "title": "Lorem ipsum dolor sit amet",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123"
				},
				{
				    "title": "Lorem ipsum dolor sit amet",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012302",
				    "contentDocumentId": "123"
				},
				{
				    "title": "Lorem ipsum dolor sit amet",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012303",
				    "contentDocumentId": "123"
				},
				{
				    "title": "Lorem ipsum dolor sit amet",
				    "fileExtension": "jpg",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123"
				},
				{
				    "title": "Lorem ipsum dolor sit amet",
				    "fileExtension": "png",
				    "recordId": "0123456789012302",
				    "contentDocumentId": "123"
				},
				{
				    "title": "Lorem ipsum dolor sit amet",
				    "fileExtension": "gif",
				    "recordId": "0123456789012303",
				    "contentDocumentId": "123"
				},
				{
				    "title": "Lorem ipsum dolor sit amet",
				    "fileExtension": "xls",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123"
				},
				{
				    "title": "Lorem ipsum dolor sit amet",
				    "fileExtension": "ppt",
				    "recordId": "0123456789012302",
				    "contentDocumentId": "123"
				},
				{
				    "title": "Lorem ipsum dolor sit amet",
				    "fileExtension": "xlsx",
				    "recordId": "0123456789012303",
				    "contentDocumentId": "123"
				}
			],
			{
			    status: true
			}
		);
    }

    return {
        getTopLevelCategories: getTopLevelCategories,
        getCategoryDetail: getCategoryDetail,
        getSubCategories: getSubCategories,
        getParentCategory: getParentCategory,
        getRelatedContent: getRelatedContent,
        getCategory: getCategory
    };
});
var app = angular.module("dsaApp");

app.factory("DSARemoterContentItemExtensionStub", function () {
    function getContentItemDetail(contentItemId, callback, options) {
        callback(
			{
			    "recordId": "0123456789012341",
			    "contentDocumentId": "0123456789012301",
			    "title": "Sales Cloud Product Demo",
			    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lectus leo elementum non sollicitudin vitae, pellentesque in leo. Nullam a eros aliquet dolor consequat viverra.",
			    "fileType": "LINK",
			    "linkUrl": "http://www.google.com",
			    "contentSize": "",
			    "smallImageUrl": "images/market-bg2-hi.jpg",
			    "myVote": "up",
			    "upVotes": "13",
			    "downVotes": "2",
			    "largeImageUrl": "images/market-bg2-hi.jpg",
			    //"streamUUID":"123456789",
			    "comments": [

			    ],
			    "createdByUser": {
			        "firstName": "John",
			        "lastName": "Doe"
			    },
			    "lastModified": 1402444800000,
			    "fileExtension": ".html",
			    "sourceContentDocumentId": "0123456789012303",
			    "externalApproved": false
			},
			{
			    status: true
			}
		);
    }

    function getContentItems(pageNumber, callback, options) {
        var page1 = {
            pageNumber: 1,
            totalPages: 2,
            totalItems: 6,
            items: [
				{
				    "title": "2. Benefits",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ]
				},
				{
				    "title": "3. Force.com API",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"programming",
						"force.com",
						"apex"
				    ]
				},
				{
				    "title": "Force.com Training",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"force.com",
						"apex",
						"visualforce"
				    ]
				}
            ]
        };
        var page2 = {
            pageNumber: 2,
            totalPages: 2,
            totalItems: 6,
            items: [
				{
				    "title": "Intro to SFDC",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ]
				},
				{
				    "title": "Sales Cloud Video",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"sales"
				    ]
				},
				{
				    "title": "Service Cloud White Paper",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"service",
						"white paper"
				    ]
				}
            ]
        };
        var page;
        if (pageNumber == 1) {
            page = page1;
        } else {
            page = page2;
        }
        callback(
			page,
			{
			    status: true
			}
		);
    }

    function getContentItemsForPrefix(prefix, callback, options) {
        callback(
			[
				{
				    "title": prefix + "Intro to SFDC",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ]
				},
				{
				    "title": prefix + "Sales Cloud Video",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"sales"
				    ]
				},
				{
				    "title": prefix + "Service Cloud White Paper",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"service",
						"white paper"
				    ]
				}
			],
			{
			    status: true
			}
		);
    }

    function getFeaturedContent(callback, options) {
        callback(
			[
				{
				    "title": "Featured Benefits",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ]
				},
				{
				    "title": "Featured Force.com API",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"programming",
						"force.com",
						"apex"
				    ]
				},
				{
				    "title": "Featured Force.com Training",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"force.com",
						"apex",
						"visualforce"
				    ]
				}
			],
			{
			    status: true
			}
		);
    }

    function getFeaturedContentForPrefix(prefix, callback, options) {
        callback(
			[
				{
				    "title": prefix + "Featured Benefits",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ]
				},
				{
				    "title": prefix + "Featured Force.com API",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"programming",
						"force.com",
						"apex"
				    ]
				},
				{
				    "title": prefix + "Featured Force.com Training",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"force.com",
						"apex",
						"visualforce"
				    ]
				}
			],
			{
			    status: true
			}
		);
    }

    function getTrendingContent(customerFacingMode, callback, options) {
        callback(
			[
				{
				    "title": "Intro to SFDC",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ]
				},
				{
				    "title": "Benefits",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ]
				},
				{
				    "title": "Force.com API",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"programming",
						"force.com",
						"apex"
				    ]
				}
			],
			{
			    status: true
			}
		);
    }

    function getMostRecentContent(callback, options) {
        callback(
			[
				{
				    "title": "Sales Cloud Video",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"sales"
				    ]
				},
				{
				    "title": "Force.com API",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"programming",
						"force.com",
						"apex"
				    ]
				},
				{
				    "title": "Benefits",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ]
				}
			],
			{
			    status: true
			}
		);
    }

    function getRelatedContent(contentItemId, callback, options) {
        callback(
			[
				{
				    "title": "Related Sales Cloud Video",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"sales"
				    ]
				},
				{
				    "title": "Related Force.com API",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"programming",
						"force.com",
						"apex"
				    ]
				},
				{
				    "title": "Related Benefits",
				    "fileExtension": ".docx",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ]
				}
			],
			{
			    status: true
			}
		);
    }

    function logContentReview(contentItemId, device, orientation, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function thumbsUpContentItem(contentItemId, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function thumbsDownContentItem(contentItemId, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function getTrendingContentByViews(callback, options) {
        callback(
			[
				{
				    "title": "Intro to SFDC",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ],
				    "viewCount": 5
				},
				{
				    "title": "Benefits",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ],
				    "viewCount": 3
				},
				{
				    "title": "https://na17.salesforce.com/068o0000000QDo6",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"programming",
						"force.com",
						"apex"
				    ],
				    "viewCount": 1
				}
			],
			{
			    status: true
			}
		);
    }

    function getTrendingContentByVotes(callback, options) {
        callback(
			[
				{
				    "title": "Force.com API",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"programming",
						"force.com",
						"apex"
				    ],
				    "ratingCount": 100
				},
				{
				    "title": "Benefits",
				    "fileExtension": "pdf",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ],
				    "ratingCount": 5
				},
				{
				    "title": "Intro to SFDC",
				    "fileExtension": ".mov",
				    "recordId": "0123456789012301",
				    "contentDocumentId": "123",
				    "tags": [
						"new hires"
				    ],
				    "ratingCount": 3
				}
			],
			{
			    status: true
			}
		);
    }

    return {
        getContentItemDetail: getContentItemDetail,
        getContentItems: getContentItems,
        getFeaturedContent: getFeaturedContent,
        getTrendingContent: getTrendingContent,
        getMostRecentContent: getMostRecentContent,
        getRelatedContent: getRelatedContent,
        logContentReview: logContentReview,
        thumbsUpContentItem: thumbsUpContentItem,
        thumbsDownContentItem: thumbsDownContentItem,
        getTrendingContentByVotes: getTrendingContentByVotes,
        getTrendingContentByViews: getTrendingContentByViews,
        getFeaturedContentForPrefix: getFeaturedContentForPrefix,
        getContentItemsForPrefix: getContentItemsForPrefix
    };
});
var app = angular.module("dsaApp");

app.factory("DSARemoterHubExtensionStub", function () {
    function getFeaturedHubs(customerFacingMode, callback, options) {
        callback(
			[
				{
				    "recordId": "0123456789012341",
				    "name": "Getting Started",
				    "smallImageUrl": "images/market-bg2-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012342",
				    "name": "Dreamforce",
				    "smallImageUrl": "images/customize-bg-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012343",
				    "name": "Salesforce1",
				    "smallImageUrl": "images/sell-bg1-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012344",
				    "name": "Sales Cloud",
				    "smallImageUrl": "images/sell-bg2-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012345",
				    "name": "Marketing Cloud",
				    "smallImageUrl": "images/service-bg1-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012346",
				    "name": "Service Cloud",
				    "smallImageUrl": "images/service-bg2-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				}
			],
			{
			    status: true
			}
		);
    }

    function getHubDetail(recordId, customerFacingMode, callback, options) {
        callback(
			{
			    "recordId": "0123456789012344",
			    "externalApproved": false,
			    "name": "Sales Cloud",
			    "curator": {
			        "firstName": "Adam",
			        "lastName": "Local",
			        "chatterProfileUrl": "TBD",
			        "smallPhotoUrl": "TBD",
			        "email": "adam@local.com"
			    },
			    "largeImageUrl": "images/sell-bg2-hi.jpg",
			    "smallImageUrl": "images/sell-bg2-hi.jpg",
			    "iconImageUrl": "images/Default-Hub-Avatar.png",
			    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lectus leo elementum non sollicitudin vitae, pellentesque in leo. Nullam a eros aliquet dolor consequat viverra.",
			    "relatedHubs": [
					{
					    "recordId": "0123456789012301",
					    "name": "Data.com",
					    "smallImageUrl": "../images/market-bg2-hi.jpg",
					    "iconImageUrl": "images/Default-Hub-Avatar.png"
					},
					{
					    "recordId": "0123456789012302",
					    "name": "Work.com",
					    "smallImageUrl": "../images/sell-bg1-hi.jpg",
					    "iconImageUrl": "images/Default-Hub-Avatar.png"
					},
					{
					    "recordId": "0123456789012303",
					    "name": "Pardot",
					    "smallImageUrl": "../images/sell-bg2-hi.jpg",
					    "iconImageUrl": "images/Default-Hub-Avatar.png"
					},
					{
					    "recordId": "0123456789012304",
					    "name": "Sales Performance Accelerator",
					    "smallImageUrl": "../images/service-bg1-hi.jpg",
					    "iconImageUrl": "images/Default-Hub-Avatar.png"
					},
					{
					    "recordId": "0123456789012305",
					    "name": "Dreamforce",
					    "smallImageUrl": "../images/customize-bg-hi.jpg",
					    "iconImageUrl": "images/Default-Hub-Avatar.png"
					}
			    ],
			    "playlistDetails": [
					{
					    "recordId": "pl1",
					    "name": "Analyst Reports & Whitepapers",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": ".mov",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "mpg",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "wmv",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					},
					{
					    "recordId": "pl2",
					    "name": "eBooks",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "pdf",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "pdf",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "pdf",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					},
					{
					    "recordId": "pl3",
					    "name": "Infographics",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "jpg",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "png",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "gif",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					},
					{
					    "recordId": "pl4",
					    "name": "Data Sheets",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "xls",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "ppt",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "xlsx",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					},
					{
					    "recordId": "pl1",
					    "name": "Product Videos",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": ".mov",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "mpg",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "wmv",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					},
					{
					    "recordId": "pl2",
					    "name": "eBooks",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "pdf",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "pdf",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "pdf",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					},
					{
					    "recordId": "pl3",
					    "name": "Infographics",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "jpg",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "png",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "gif",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					},
					{
					    "recordId": "pl4",
					    "name": "Data Sheets",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "xls",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "ppt",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "xlsx",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					},
					{
					    "recordId": "pl1",
					    "name": "Product Videos",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": ".mov",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "mpg",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "wmv",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					},
					{
					    "recordId": "pl2",
					    "name": "eBooks",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "pdf",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "pdf",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "pdf",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					},
					{
					    "recordId": "pl3",
					    "name": "Infographics",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "jpg",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "png",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "gif",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					},
					{
					    "recordId": "pl4",
					    "name": "Data Sheets",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "description": "",
					    "largeImageUrl": "",
					    "commentCount": "59",
					    "followerCount": "300",
					    "contentItems": [
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "xls",
							    "recordId": "0123456789012301",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "ppt",
							    "recordId": "0123456789012302",
							    "contentDocumentId": "123"
							},
							{
							    "title": "Lorem ipsum dolor sit amet",
							    "fileExtension": "xlsx",
							    "recordId": "0123456789012303",
							    "contentDocumentId": "123"
							}
					    ]
					}
			    ],
			    "contentItems": [
					{
					    "title": "Sales Cloud Product Demo",
					    //"smallImageUrl": "images/service-bg2-hi.jpg",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123",
					    "fileExtension": ".doc"
					},
					{
					    "title": "Herman Miller Customer Story",
					    "smallImageUrl": "images/service-bg1-hi.jpg",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123"
					},
					{
					    "title": "Sales Cloud & The Internet of Customers",
					    "smallImageUrl": "images/sell-bg1-hi.jpg",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123"
					}
			    ]
			},
			{
			    status: true
			}
		);
    }

    function getAllHubs(customerFacingMode, callback, options) {
        callback(
			[
				{
				    "recordId": "0123456789012341",
				    "name": "?Getting Started",
				    "smallImageUrl": "images/market-bg2-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012342",
				    "name": "Dreamforce",
				    "smallImageUrl": "images/customize-bg-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012343",
				    "name": "Salesforce1",
				    "smallImageUrl": "images/sell-bg1-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012344",
				    "name": "Sales Cloud",
				    "smallImageUrl": "images/sell-bg2-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012345",
				    "name": "Marketing Cloud",
				    "smallImageUrl": "images/service-bg1-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012346",
				    "name": "Service Cloud",
				    "smallImageUrl": "images/service-bg2-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				}
			],
			{
			    status: true
			}
		);
    }

    function getHubsForPrefix(prefix, externalApprovedOnly, callback, options) {
        callback(
			[
				{
				    "recordId": "0123456789012341",
				    "name": prefix + "Getting Started",
				    "smallImageUrl": "images/market-bg2-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012342",
				    "name": prefix + "Dreamforce",
				    "smallImageUrl": "images/customize-bg-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012343",
				    "name": prefix + "Salesforce1",
				    "smallImageUrl": "images/sell-bg1-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012344",
				    "name": prefix + "Sales Cloud",
				    "smallImageUrl": "images/sell-bg2-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012345",
				    "name": prefix + "Marketing Cloud",
				    "smallImageUrl": "images/service-bg1-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				},
				{
				    "recordId": "0123456789012346",
				    "name": prefix + "Service Cloud",
				    "smallImageUrl": "images/service-bg2-hi.jpg",
				    "iconImageUrl": "images/Default-Hub-Avatar.png"
				}
			],
			{
			    status: true
			}
		);
    }

    return {
        getFeaturedHubs: getFeaturedHubs,
        getHubDetail: getHubDetail,
        getAllHubs: getAllHubs,
        getHubsForPrefix: getHubsForPrefix
    };
});
var app = angular.module("dsaApp");

app.factory("DSARemoterInfoExtensionStub", function () {

    function getInfo(callback, options) {
        callback(
			{
			    "user": {
			        "recordId": "3209483094802002",
			        "email": "john@doe.com",
			        "lastName": "Doe",
			        "firstName": "John",
			        "username": "aschu",
			        "isContentUser": true
			    },
			    "preferredLanguageCodes": [

			    ],
			    "appName": "Hoa Kula",
			    "appVersion": "1.0",
			    "supportUrl": "www.google.com",
			    "isChatterEnabled": true,
			    "preferredMobileAppConfiguration": "mac1",
			    "currentMACTitle": "MAC 1",
			    "isFeaturePlaylistAdmin": true
			},
			{
			    status: true
			}
		);
    }

    function setPreferredLanguageCodes(preferredLanguageCodes, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function setPreferredMobileAppConfiguration(mobileAppConfigId, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    return {
        getInfo: getInfo,
        setPreferredLanguageCodes: setPreferredLanguageCodes,
        setPreferredMobileAppConfiguration: setPreferredMobileAppConfiguration
    };
});
var app = angular.module("dsaApp");

app.factory("DSARemoterMobileAppConfigExtensionStub", function () {

    function getMobileAppConfigurations(callback, options) {
        callback(
			[
				{
				    "mobileAppConfigId": "mac0",
				    "mobileAppConfigName": "MAC 0",
				    "titleText": "Name 0",
				    "landscapeBackgroundImageURL": "images/market-bg2-hi.jpg",
				    "portraitBackgroundImageURL": "images/market-bg2-hi.jpg"
				},
				{
				    "mobileAppConfigId": "mac1",
				    "mobileAppConfigName": "MAC 1",
				    "titleText": "Name 1",
				    "landscapeBackgroundImageURL": "images/customize-bg-hi.jpg",
				    "portraitBackgroundImageURL": "images/customize-bg-hi.jpg"
				},
				{
				    "mobileAppConfigId": "mac2",
				    "mobileAppConfigName": "MAC 2",
				    "titleText": "Name 2",
				    "landscapeBackgroundImageURL": "images/sell-bg1-hi.jpg",
				    "portraitBackgroundImageURL": "images/sell-bg1-hi.jpg"
				},
				{
				    "mobileAppConfigId": "mac3",
				    "mobileAppConfigName": "MAC 3",
				    "titleText": "Name 3",
				    "landscapeBackgroundImageURL": "images/sell-bg2-hi.jpg",
				    "portraitBackgroundImageURL": "images/sell-bg2-hi.jpg"
				},
				{
				    "mobileAppConfigId": "mac4",
				    "mobileAppConfigName": "MAC 4",
				    "titleText": "Name 4",
				    "landscapeBackgroundImageURL": "images/service-bg1-hi.jpg",
				    "portraitBackgroundImageURL": "images/service-bg1-hi.jpg"
				},
				{
				    "mobileAppConfigId": "mac5",
				    "mobileAppConfigName": "MAC 5",
				    "titleText": "Name 5",
				    "landscapeBackgroundImageURL": "images/service-bg2-hi.jpg",
				    "portraitBackgroundImageURL": "images/service-bg2-hi.jpg"
				},
				{
				    "mobileAppConfigId": "mac6",
				    "mobileAppConfigName": "MAC 6",
				    "titleText": "Name 6",
				    "landscapeBackgroundImageURL": "images/service-bg2-hi.jpg",
				    "portraitBackgroundImageURL": "images/service-bg2-hi.jpg"
				}
			],
			{
			    status: true
			}
		);
    }

    return {
        getMobileAppConfigurations: getMobileAppConfigurations
    };
});
var app = angular.module("dsaApp");

app.factory("DSARemoterPlaylistExtensionStub", function () {
    function getPlaylistDetail(playlistId, callback, options) {
        callback(
			{
			    "recordId": "pl1",
			    "name": "New Product Videos and other really fun stuff",
			    "smallImageUrl": "",
			    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lectus leo elementum non sollicitudin vitae, pellentesque in leo. Nullam a eros aliquet dolor consequat viverra.",
			    "largeImageUrl": "",
			    "commentCount": "59",
			    "followerCount": "300",
			    "contentItems": [
					{
					    "title": "1. Lorem ipsum dolor sit amet",
					    "fileExtension": ".mov",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123",
					    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lectus leo elementum non sollicitudin vitae, pellentesque in leo. Nullam a eros aliquet dolor consequat viverra."
					},
					{
					    "title": "2. Lorem ipsum dolor sit amet",
					    "fileExtension": "mpg",
					    "recordId": "0123456789012302",
					    "contentDocumentId": "123",
					    "description": "Lorem ipsum dolor sit amet"//, consectetur adipiscing elit. Aliquam lectus leo elementum non sollicitudin vitae, pellentesque in leo. Nullam a eros aliquet dolor consequat viverra."
					},
					{
					    "title": "3. Lorem ipsum dolor sit amet",
					    "fileExtension": "wmv",
					    "recordId": "0123456789012303",
					    "contentDocumentId": "123",
					    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lectus leo elementum non sollicitudin vitae, pellentesque in leo. Nullam a eros aliquet dolor consequat viverra."
					}
			    ],
			    "createdByUser": {
			        "firstName": "John",
			        "lastName": "Doe"
			    },
			    "lastModified": 1402444800000,
			    "followedByMe": true,
			    "ownerId": "3209483094802002",
			    "hasEditAccess": true,
			    "externalApproved": false
			},
			{
			    status: true
			}
		);
    }

    function getPlaylists(pageNumber, callback, options) {
        var page1 = {
            "pageNumber": 1,
            "totalPages": 2,
            "totalItems": 12,
            "items": [
				{
				    "recordId": "pl1",
				    "name": "Call Centers",
				    "smallImageUrl": "",
				    "iconImageUrl": "",
				    "tags": [
			         	"service"
				    ]
				},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "Call Centers2",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "eBooks",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"white papers"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "eBooks2",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"white papers"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "Human Resources",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"new hires"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "Human Resources2",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"new hires"
			   	    ]
			   	}
            ]
        };
        var page2 = {
            "pageNumber": 2,
            "totalPages": 2,
            "totalItems": 12,
            "items": [
				{
				    "recordId": "pl1",
				    "name": "Product Videos",
				    "smallImageUrl": "",
				    "iconImageUrl": "",
				    "tags": [
			         	"products",
			         	"sales",
			         	"service"
				    ]
				},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "Product Videos2",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			        	"products",
			        	"sales",
			        	"service"
			   	    ]
			   	},
				{
				    "recordId": "pl2",
				    "name": "Renewals",
				    "smallImageUrl": "",
				    "iconImageUrl": "",
				    "tags": [
			         	"sales"
				    ]
				},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "Renewals2",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sales"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "Sites Benefits",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "Sites Benefits2",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	}
            ]
        };
        var page;
        if (pageNumber == 1) {
            page = page1;
        } else {
            page = page2;
        }
        callback(
			page,
			{
			    status: true
			}
		);
    }

    function getPlaylistsForPrefix(prefix, callback, options) {
        callback(
			[
				{
				    "recordId": "pl1",
				    "name": prefix + "Product Videos",
				    "smallImageUrl": "",
				    "iconImageUrl": "",
				    "tags": [
			         	"products",
			         	"sales",
			         	"service"
				    ]
				},
			   	{
			   	    "recordId": "pl1",
			   	    "name": prefix + "Product Videos2",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			        	"products",
			        	"sales",
			        	"service"
			   	    ]
			   	},
				{
				    "recordId": "pl2",
				    "name": prefix + "Renewals",
				    "smallImageUrl": "",
				    "iconImageUrl": "",
				    "tags": [
			         	"sales"
				    ]
				}
			],
			{
			    status: true
			}
		);
    }

    function getMyPlaylists(callback, options) {
        callback(
			[
				{
				    "recordId": "pl1",
				    "name": "My Call Centers",
				    "smallImageUrl": "",
				    "iconImageUrl": "",
				    "tags": [
			         	"service"
				    ]
				},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "My Product Videos",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"products",
			         	"sales",
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "My Sites Benefits",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "My Call Centers",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "My Product Videos",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"products",
			         	"sales",
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "My Sites Benefits",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "My Call Centers",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "My Product Videos",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"products",
			         	"sales",
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "My Sites Benefits",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "My Call Centers",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "My Product Videos",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"products",
			         	"sales",
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "My Sites Benefits",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "My Call Centers",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "My Product Videos",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"products",
			         	"sales",
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "My Sites Benefits",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	}
			],
			{
			    status: true
			}
		);
    }

    function getMyPlaylistsForPrefix(prefix, callback, options) {
        callback(
			[
				{
				    "recordId": "pl1",
				    "name": prefix + "My Call Centers",
				    "smallImageUrl": "",
				    "iconImageUrl": "",
				    "tags": [
			         	"service"
				    ]
				},
			   	{
			   	    "recordId": "pl1",
			   	    "name": prefix + "My Product Videos",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"products",
			         	"sales",
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": prefix + "My Sites Benefits",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	}
			],
			{
			    status: true
			}
		);
    }

    function getFeaturedPlaylists(callback, options) {
        callback(
			[
				{
				    "recordId": "pl1",
				    "name": "Featured Call Centers",
				    "smallImageUrl": "",
				    "iconImageUrl": "",
				    "tags": [
			         	"service"
				    ]
				},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "Featured Product Videos",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"products",
			         	"sales",
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "Featured Sites Benefits",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	}
			],
			{
			    status: true
			}
		);
    }

    function getFeaturedPlaylistsForPrefix(prefix, callback, options) {
        callback(
			[
				{
				    "recordId": "pl1",
				    "name": prefix + "Featured Call Centers",
				    "smallImageUrl": "",
				    "iconImageUrl": "",
				    "tags": [
			         	"service"
				    ]
				},
			   	{
			   	    "recordId": "pl1",
			   	    "name": prefix + "Featured Product Videos",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"products",
			         	"sales",
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": prefix + "Featured Sites Benefits",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	}
			],
			{
			    status: true
			}
		);
    }

    function getFollowedPlaylists(callback, options) {
        callback(
			[
				{
				    "recordId": "pl1",
				    "name": "Followed Call Centers",
				    "smallImageUrl": "",
				    "iconImageUrl": "",
				    "tags": [
			         	"service"
				    ]
				},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "Followed Product Videos",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"products",
			         	"sales",
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "Followed Sites Benefits",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	}
			],
			{
			    status: true
			}
		);
    }

    function createPlaylist(title, description, customerFacingMode, callback, options) {
        callback(
			{
			    "recordId": "pl2",
			    "name": title,
			    "smallImageUrl": "",
			    "iconImageUrl": "",
			    "tags": [
		         	"sites"
			    ]
			},
			{
			    status: true
			}
		);
    }

    function addToPlaylist(playListId, contentDocumentId, callback, options) {
        callback(
			{},
			{
			    status: true
			}
		);
    }

    function removeFromPlaylist(playListId, contentDocumentId, callback, options) {
        callback(
			{},
			{
			    status: true
			}
		);
    }

    function followPlaylist(playlistId, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		)
    }

    function unFollowPlaylist(playlistId, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		)
    }

    function getPlaylistPosts(playlistId, callback, options) {
        callback(
			[
				{
				    "post": {
				        "Parent": {
				            "Name": "Awesome Playlist",
				            "Id": "a22o0000000TsRyAAK"
				        },
				        "Body": "JELLO pudding!",
				        "ParentId": "a22o0000000TsRyAAK",
				        "Type": "TextPost",
				        "CreatedById": "005o0000000MX8wAAG",
				        "CreatedBy": {
				            "FirstName": "Adam",
				            "Id": "005o0000000MX8wAAG",
				            "LastName": "Schultz",
				            "SmallPhotoUrl": "../images/userThumbnail.png"
				        },
				        "CreatedDate": 1406747842000,
				        "Id": "0D5o00000025U3lCAE",
				        "FeedLikes": [
		            		{
		            		    "CreatedBy": {
		            		        "FirstName": "Adam",
		            		        "Id": "3209483094802002",
		            		        "LastName": "Schultz"
		            		    }
		            		}
				        ],
				        "InsertedBy": {
				            "Id": "005o0000000MX8wAAG",
				            "Profile": {
				                "Id": "00eo0000000QX2yAAG",
				                "CreatedBy": {
				                    "Id": "005o0000000MWeRAAW",
				                    "SmallPhotoUrl": "../images/userThumbnail.png"
				                },
				                "CreatedById": "005o0000000MWeRAAW"
				            },
				            "ProfileId": "00eo0000000QX2yAAG"
				        },
				        "InsertedById": "005o0000000MX8wAAG"
				    },
				    "smallPhotoUrl": "../images/userThumbnail.png",
				    "comments": [

				    ]
				},
				{
				    "post": {
				        "Parent": {
				            "Name": "Awesome Playlist",
				            "Id": "a22o0000000TsRyAAK"
				        },
				        "Body": "the playlist creator has style",
				        "ParentId": "a22o0000000TsRyAAK",
				        "Type": "TextPost",
				        "CreatedById": "005o0000000MX8wAAG",
				        "CreatedBy": {
				            "FirstName": "Adam",
				            "Id": "005o0000000MX8wAAG",
				            "LastName": "Schultz",
				            "SmallPhotoUrl": "../images/userThumbnail.png"
				        },
				        "CreatedDate": 1406747842000,
				        "Id": "0D5o00000025TrnCAE",
				        "InsertedBy": {
				            "Id": "005o0000000MX8wAAG",
				            "Profile": {
				                "Id": "00eo0000000QX2yAAG",
				                "CreatedBy": {
				                    "Id": "005o0000000MWeRAAW",
				                    "SmallPhotoUrl": "../images/userThumbnail.png"
				                },
				                "CreatedById": "005o0000000MWeRAAW"
				            },
				            "ProfileId": "00eo0000000QX2yAAG"
				        },
				        "InsertedById": "005o0000000MX8wAAG"
				    },
				    "smallPhotoUrl": "../images/userThumbnail.png",
				    "comments": [
	         			{
	         			    "comment": {
	         			        "CommentBody": "This is a comment to a comment.",
	         			        "CreatedDate": 1406870260000,
	         			        "CreatedBy": {
	         			            "FirstName": "Jim",
	         			            "LastName": "Doe"
	         			        }
	         			    },
	         			    "smallPhotoUrl": "../images/userThumbnail.png",
	         			    "commentLikes": [
	         					{
	         					    "chatterLike": {
	         					        "id": "0I0o0000000TOohCAG",
	         					        "user": {
	         					            "id": "3209483094802002"
	         					        }
	         					    }
	         					},
	         					{
	         					    "chatterLike": {
	         					        "id": "0I0o0000000TOohCAG",
	         					        "user": {
	         					            "id": "005o0000000MWeRAAW"
	         					        }
	         					    }
	         					}
	         			    ]
	         			}
				    ]
				},
				{
				    "post": {
				        "Parent": {
				            "Name": "Awesome Playlist",
				            "Id": "a22o0000000TsRyAAK"
				        },
				        "Body": "this playlist is indeed awesome",
				        "ParentId": "a22o0000000TsRyAAK",
				        "Type": "TextPost",
				        "CreatedById": "005o0000000MX8wAAG",
				        "CreatedBy": {
				            "FirstName": "Adam",
				            "Id": "005o0000000MX8wAAG",
				            "LastName": "Schultz",
				            "SmallPhotoUrl": "../images/userThumbnail.png"
				        },
				        "CreatedDate": 1406747842000,
				        "Id": "0D5o00000025U3MCAU",
				        "InsertedBy": {
				            "Id": "005o0000000MX8wAAG",
				            "Profile": {
				                "Id": "00eo0000000QX2yAAG",
				                "CreatedBy": {
				                    "Id": "005o0000000MWeRAAW",
				                    "SmallPhotoUrl": "../images/userThumbnail.png"
				                },
				                "CreatedById": "005o0000000MWeRAAW"
				            },
				            "ProfileId": "00eo0000000QX2yAAG"
				        },
				        "InsertedById": "005o0000000MX8wAAG"
				    },
				    "smallPhotoUrl": "../images/userThumbnail.png",
				    "comments": [

				    ]
				}
			],
			{
			    status: true
			}
		);
    }

    function updatePlaylist(playlistId, title, description, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function postOnPlaylist(playlistId, commentText, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function deletePlaylist(playlistId, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function removeLike(feedItemId, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function addLike(feedItemId, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function thumbsUpComment(commentId, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function thumbsUpPost(feedItemId, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function logPlaylistReview(playlistId, device, orientation, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    function getTrendingPlaylistByViews(callback, options) {
        callback(
			[
				{
				    "recordId": "pl1",
				    "name": "Trending Call Centers",
				    "smallImageUrl": "",
				    "iconImageUrl": "",
				    "tags": [
			         	"service"
				    ]
				},
			   	{
			   	    "recordId": "pl1",
			   	    "name": "Trending Product Videos",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"products",
			         	"sales",
			         	"service"
			   	    ]
			   	},
			   	{
			   	    "recordId": "pl2",
			   	    "name": "Trending Sites Benefits",
			   	    "smallImageUrl": "",
			   	    "iconImageUrl": "",
			   	    "tags": [
			         	"sites"
			   	    ]
			   	}
			],
			{
			    status: true
			}
		);
    }

    function orderPlaylist(playlistId, orderedContentMap, callback, options) {
        callback(
			null,
			{
			    status: true
			}
		);
    }

    return {
        getPlaylistDetail: getPlaylistDetail,
        getPlaylists: getPlaylists,
        getMyPlaylists: getMyPlaylists,
        getFeaturedPlaylists: getFeaturedPlaylists,
        getFollowedPlaylists: getFollowedPlaylists,
        createPlaylist: createPlaylist,
        addToPlaylist: addToPlaylist,
        removeFromPlaylist: removeFromPlaylist,
        unFollowPlaylist: unFollowPlaylist,
        followPlaylist: followPlaylist,
        getPlaylistPosts: getPlaylistPosts,
        updatePlaylist: updatePlaylist,
        postOnPlaylist: postOnPlaylist,
        deletePlaylist: deletePlaylist,
        thumbsUpComment: thumbsUpComment,
        removeLike: removeLike,
        thumbsUpPost: thumbsUpPost,
        addLike: addLike,
        getFeaturedPlaylistsForPrefix: getFeaturedPlaylistsForPrefix,
        getPlaylistsForPrefix: getPlaylistsForPrefix,
        getMyPlaylistsForPrefix: getMyPlaylistsForPrefix,
        logPlaylistReview: logPlaylistReview,
        getTrendingPlaylistByViews: getTrendingPlaylistByViews,
        orderPlaylist: orderPlaylist
    };
});
var app = angular.module("dsaApp");

app.factory("DSARemoterSearchExtensionStub", function () {
    function search(searchTerm, callback, options) {
        callback(
			{
			    "hubs": [
					{
					    "recordId": "0123456789012341",
					    "name": "Getting Started",
					    "smallImageUrl": "images/market-bg2-hi.jpg",
					    "iconImageUrl": "images/Default-Hub-Avatar.png",
					    "tags": [
							"new hires"
					    ]
					},
					{
					    "recordId": "0123456789012342",
					    "name": "Dreamforce",
					    "smallImageUrl": "images/customize-bg-hi.jpg",
					    "iconImageUrl": "images/Default-Hub-Avatar.png",
					    "tags": [
							"dreamforce",
							"sales"
					    ]
					},
					{
					    "recordId": "0123456789012341",
					    "name": "Sales Cloud",
					    "smallImageUrl": "images/market-bg2-hi.jpg",
					    "iconImageUrl": "images/Default-Hub-Avatar.png",
					    "tags": [
							"sales"
					    ]
					},
					{
					    "recordId": "0123456789012342",
					    "name": "Service Cloud",
					    "smallImageUrl": "images/customize-bg-hi.jpg",
					    "iconImageUrl": "images/Default-Hub-Avatar.png",
					    "tags": [
							"service"
					    ]
					},
					{
					    "recordId": "0123456789012341",
					    "name": "Force.com",
					    "smallImageUrl": "images/market-bg2-hi.jpg",
					    "iconImageUrl": "images/Default-Hub-Avatar.png",
					    "tags": [
							"apex",
							"visualforce"
					    ]
					},
					{
					    "recordId": "0123456789012342",
					    "name": "Industries",
					    "smallImageUrl": "images/customize-bg-hi.jpg",
					    "iconImageUrl": "images/Default-Hub-Avatar.png",
					    "tags": [
							"sales",
							"service"
					    ]
					}
			    ],
			    "playlists": [
					{
					    "recordId": "pl1",
					    "name": "Product Videos",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "tags": [
							"products",
							"sales",
							"service"
					    ]
					},
					{
					    "recordId": "pl2",
					    "name": "eBooks",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "tags": [
							"white papers"
					    ]
					},
					{
					    "recordId": "pl1",
					    "name": "Human Resources",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "tags": [
							"new hires"
					    ]
					},
					{
					    "recordId": "pl2",
					    "name": "Renewals",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "tags": [
							"sales"
					    ]
					},
					{
					    "recordId": "pl1",
					    "name": "Call Centers",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "tags": [
							"service"
					    ]
					},
					{
					    "recordId": "pl2",
					    "name": "Sites Benefits",
					    "smallImageUrl": "",
					    "iconImageUrl": "",
					    "tags": [
							"sites"
					    ]
					}
			    ],
			    "contentItemDetails": [
					{
					    "title": "Sales Cloud Video",
					    "fileExtension": ".mov",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123",
					    "tags": [
							"sales"
					    ]
					},
					{
					    "title": "Service Cloud White Paper",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123",
					    "tags": [
							"service",
							"white paper"
					    ]
					},
					{
					    "title": "Force.com Training",
					    "fileExtension": ".mov",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123",
					    "tags": [
							"force.com",
							"apex",
							"visualforce"
					    ]
					},
					{
					    "title": "Force.com API",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123",
					    "tags": [
							"programming",
							"force.com",
							"apex"
					    ]
					},
					{
					    "title": "Intro to SFDC",
					    "fileExtension": ".mov",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123",
					    "tags": [
							"new hires"
					    ]
					},
					{
					    "title": "http://www.salesforce.com/us/developer/docs/pages/Content/pages_variables_functions.htm",
					    "fileExtension": "pdf",
					    "recordId": "0123456789012301",
					    "contentDocumentId": "123",
					    "tags": [
							"new hires"
					    ]
					}
			    ]
			},
			{
			    status: true
			}
		);
    }

    return {
        search: search
    };
});

//# sourceMappingURL=app.js.map

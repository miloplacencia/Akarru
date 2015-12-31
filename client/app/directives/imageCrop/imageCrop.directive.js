'use strict';

/**
 * Created by ezgoing on 14/9/2014, modified by milo on 9/11/2014
 */

var cropbox = function(options)
{
	this.el			= options.imageBox;
	this.zel		= $(this.el);
	this.state		= {};
	this.options	= options;
	this.ratio		= options.ratio || 1;
	this.spinner	= options.spinner;
	this.image		= new Image();
	this.iWidth		= 0;
	this.iHeight	= 0;
	this.fileSearch	= options.fileSearch;
	this.ratioMax	= 1.05;
	this.ratioMin	= 0.95;

	var self = this;

	this.clientSize = (function()
	{
		return {
			w: self.el.clientWidth,
			h: self.el.clientHeight
		};
	})();

	this.init();
};

var setBackground = function(self)
	{
		var bgPos = self.el.style.backgroundPosition;
		var w,h,pw,ph;
		var cs = self.clientSize;
		var cW = cs.w, cH = cs.h;
		
		bgPos = (!!bgPos) ? bgPos.split(' ') : false ;
		w =  parseInt(self.image.width)*self.ratio;
		h =  parseInt(self.image.height)*self.ratio;
		
		pw = (!!bgPos) ? parseInt(bgPos[0]) : (cW - w) / 2;
		ph = (!!bgPos) ? parseInt(bgPos[1]) : (cH - h) / 2;

		self.el.setAttribute('style',
		      'background-image: url(' + self.image.src + '); ' +
		      'background-size: ' + w +'px ' + h + 'px; ' +
		      'background-position: ' + pw + 'px ' + ph + 'px; ' +
		      'background-repeat: no-repeat');
  	},
	imgMouseDown = function(e)
	{
		e.stopImmediatePropagation();

		this.state.dragable = true;
		this.state.mouseX = e.clientX;
		this.state.mouseY = e.clientY;
	},
	imgMouseMove = function(e)
	{
		e.stopImmediatePropagation();

		if(this.state.dragable)
		{
			var x   = e.clientX - this.state.mouseX;
			var y   = e.clientY - this.state.mouseY;

			var cs	= this.clientSize;

			var bg  = this.el.style.backgroundPosition.split(' ');
			var bgS = this.el.style.backgroundSize.split(' ');

			var bgX = x + parseInt(bg[0]);
			var bgY = y + parseInt(bg[1]);
			var bsX = parseInt(bgS[0]) - cs.w;
			var bsY = parseInt(bgS[1]) - cs.h;

			bgX = (bgX > 0)? 0 : (Math.abs(bgX) > bsX) ? -bsX : bgX;
			bgY = (bgY > 0)? 0 : (Math.abs(bgY) > bsY) ? -bsY : bgY;

			this.el.style.backgroundPosition = bgX +'px ' + bgY + 'px';

			this.state.mouseX = e.clientX;
			this.state.mouseY = e.clientY;
		}
	},
	imgMouseUp = function(e)
	{
		e.stopImmediatePropagation();
		this.state.dragable = false;
	},
	zoomImage = function(e)
	{
		e.stopPropagation();
		e.preventDefault();

		var bgSize = this.el.style.backgroundSize.split(' ');
		var bgSX = parseInt(bgSize[0]);
		var bgSY = parseInt(bgSize[1]);
		var newRatio;
		var cs 	 = this.clientSize;

		newRatio = e.deltaY < 0 ? this.ratioMax : this.ratioMin;

		var ratioX = (this.ratio * bgSX) >= cs.w || newRatio===this.ratioMax;
		var ratioY = (this.ratio * bgSY) >= cs.h || newRatio===this.ratioMax;

		this.ratio = (ratioX && ratioY) ? this.ratio * newRatio  : this.ratio;

		setBackground(this);
	},
	onloadImg = function(self)
	{
		return function()
		{
			self.iWidth = this.width;
			self.iHeight = this.height;

			self.spinner.style.display = 'none';
			setBackground(self);//.bind(this);

			self.zel.on('mousedown',imgMouseDown.bind(self));
			self.zel.on('mousemove',imgMouseMove.bind(self));
			self.zel.on('wheel',zoomImage.bind(self));
			$('body').on('mouseup',imgMouseUp.bind(self));
		};
	},
	domnoderemoved = function()
	{
		$('body').off('DOMNodeRemoved');
	},
	getExt = function(src)
	{
		return src.replace(/.+:image\/(\w+);.+/g,'$1');
	};
cropbox.prototype.detach = function()
{
	this.zel.off('mousedown');
	this.zel.off('wheel');
	$('body').off('mouseup');
	this.zel.off('DOMNodeRemoved');
};
cropbox.prototype.init = function()
{
	this.image.onload = onloadImg(this);
	this.image.src = this.options.imgSrc;

	this.zel.on('DOMNodeRemoved', domnoderemoved.bind(this));
};

var changeImage = function(imageBox,url)
{
	url = url.replace(/\\/g,'/');
	imageBox.style.backgroundImage = 'url('+url+'?t='+Date.now()+')';
	imageBox.style.backgroundSize = '100%';
	imageBox.style.backgroundPosition = '0 0';
};

angular.module('akarruBackApp')
	.directive('imageCropAvatar',function($rootScope)
	{
	   return {
	      template: [
	      		'<div class="contenedor__imageBox clearfix">',
				'<div class="imageBox" ng-class="{ \'imageLoaded\': !!image }">',
				'<label class="imageSelector" for="imageUploadAvatar" ng-show="!file.list"><span ng-if="!image">buscar</span><span ng-if="!!image">cambiar</span> imagen</label>',
				'<div class="spinner" style="display: none">Loading</div>',
				'<input type="file" id="imageUploadAvatar" style="display:none" ng-file-select="file.select($files)" >',
				'</div>',
				'<a class="imageSend" ng-click="file.upload()" ng-show="!!file.list">Subir Imagen</a>',
				'</div>'
			].join(''),
			restrict: 'E',
			scope: {
				image: '='
			},
			replace: true,
			controller: ['$scope','$upload',function($scope,$upload)
			{
				$scope.$up = $upload;
				$scope.file = {
					url: $scope.image,
					list: null,
					image: {
						ratio: 1
					},
					cropper : {
						options: {},
						new: null
					}
				};

				$scope.file.select = function($files)
				{
					this.list = $files[0];
					if(!!this.list)
					{
						var reader 	= new FileReader();
						var onloader= function(e)
						{
							var self	= this;
							var img		= document.createElement('img');
							img.onload	= function()
							{
								self.image.width = this.width;
								self.image.height= this.height;
								$scope.$digest();
							};

							img.setAttribute('src',e.target.result);

							this.cropper.options.imgSrc = e.target.result;
							this.cropper.new = new cropbox(this.cropper.options);							
						};
						reader.onload = onloader.bind(this);
						reader.readAsDataURL($files[0]);
					}
				};
			}],
			link: function ($scope, $e, attrs)
			{
				var $i = $e[0];
				var $imageBox 	= $i.querySelector('.imageBox');
				var $imageSel 	= $i.querySelector('.imageSelector');
				var $spinner	= $i.querySelector('.spinner');

				$scope.file.cropper.options = {
					imageBox	: $imageBox,
					spinner		: $spinner,
					imgSrc		: ''
				};

				if(!!$scope.image)
					changeImage($imageBox,$scope.image);

				$scope.file.upload = function()
				{
					var toNumber= function(n){
						return Math.abs(~~n.replace(/-?(\d+)px/ig,'$1'));
					};
					var bgSize 	= $imageBox.style.backgroundSize.split(' ');
					var bgPos 	= $imageBox.style.backgroundPosition.split(' ');
					this.image.posX 	= toNumber(bgPos[0]);
					this.image.posY 	= toNumber(bgPos[1]);
					this.image.nWidth 	= toNumber(bgSize[0]);
					this.image.nHeight	= toNumber(bgSize[1]);
					this.image.ratio 	= this.image.width / this.image.nWidth;
					this.image.iWidth 	= $imageBox.clientWidth;
					this.image.iHeight	= $imageBox.clientHeight;

					if(!!this.list)
					{
						$scope.upload = $scope.$up.upload({
							url 	: 'api/upload/avatar',
							method	: 'POST',
							file 	: this.list,
							data 	: {
								myModel: this.image
							}
						})/*
						.progress(function(e)
						{
							console.log(e);
						})*/
						.success(function(data)
						{
							$scope.file.url = data.user.perfil.avatar;
							$scope.file.list = null;

							$scope.file.cropper.new.detach();
							$scope.file.cropper.new = null;

							changeImage($imageBox,$scope.file.url);

							$rootScope.user.perfil.avatar = data.user.perfil.avatar+'?t='+Date.now();
						});
					}
				};

			}
	    };
	});
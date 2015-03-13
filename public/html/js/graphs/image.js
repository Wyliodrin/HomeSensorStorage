/**
 * Created by victor-vm on 3/13/2015.
 */
function MyImage(){
    this.signals = [];

    this.value = 0;
    this.urls=[];
    this.div = null;
}

MyImage.id = 'image';
MyImage.prototype = new Widget();
MyImage.prototype.constructor = MyLineWidget;

MyImage.prototype.draw=function(div,samples){
    this.div = div;
    div.empty();
    console.log (div);
    div.css("text-align","center");
    var image=document.createElement("img");
    $(image).css("height",320);
    if(this.value>=this.urls.length)
        image.src="http://www.joomlaworks.net/images/demos/galleries/abstract/7.jpg";
    else
        image.src=this.urls[this.value];
    div.html(image);
}

MyImage.prototype.update=function(){
    // this.div.empty();
    // console.log (div);
    // this.div.css("text-align","center");
    var image=this.div.find("img");
    // image.css("max-height",320);
    if(this.value>=this.urls.length)
        image.attr ("src", "http://www.joomlaworks.net/images/demos/galleries/abstract/7.jpg");
    else
        image = this.images[this.value];
    this.div.html(image);
}

MyImage.prototype.setDescription=function(description){
    this.description=description
   this.urls=description.split("\n");
   this.images = new Array();
    for (i = 0; i < this.urls.length; i++) {
        this.images[i] = new Image();
        this.images[i].src = this.urls[i];
        this.images[i].style.height ="300px";
    }
}

MyImage.prototype.setLatestValueElement=function(latestValueElement){
    latestValueElement.parent().remove();
}

MyImage.prototype.addValueToSignal = function (name, value, ts, text)
{
/*    console.log ('signals[0] '+this.signals[0].name);
    console.log ('name '+name);*/
    if (this.signals && this.signals[0] && this.signals[0].name == name.toLowerCase())
    {
        this.mustUpdate = true;
        this.value = value;
    }
}
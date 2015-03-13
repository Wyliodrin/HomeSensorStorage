/**
 * Created by victor-vm on 3/13/2015.
 */
function MyImage(){
    this.signals = [];

    this.value = 0;
    this.urls=[];
}

MyImage.id = 'image';
MyImage.prototype = new Widget();
MyImage.prototype.constructor = MyLineWidget;

MyImage.prototype.draw=function(div,samples){
    div.empty();
    div.css("text-align","center");
    var image=document.createElement("img");
    $(image).css("max-height",320);
    if(this.value>=this.urls.length)
        image.src="http://www.joomlaworks.net/images/demos/galleries/abstract/7.jpg";
    else
        image.src=this.urls[this.value];
    div.html(image);
}

MyImage.prototype.setDescription=function(description){
    this.description=description
   this.urls=description.split("\n").length;
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
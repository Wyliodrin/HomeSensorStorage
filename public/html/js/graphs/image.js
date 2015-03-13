/**
 * Created by victor-vm on 3/13/2015.
 */
function MyImage(){
    this.signals = [];

    this.value = 0;
}

MyImage.id = 'image';
MyImage.prototype = new Widget();
MyImage.prototype.constructor = MyLineWidget;

MyImage.prototype.draw=function(div,samples){
    div.empty();
    div.css("text-align","center");
    var image=document.createElement("img");
    $(image).css("max-height",320);
    if(this.value==0){
        image.src="http://www.joomlaworks.net/images/demos/galleries/abstract/7.jpg";
    }
    else if(this.value==1)
        image.src="http://www.online-image-editor.com//styles/2014/images/example_image.png";
    else if(this.value==2)
        image.src="http://www.jpl.nasa.gov/spaceimages/images/mediumsize/PIA17011_ip.jpg";
    else if(this.value==3)
        image.src="http://www.wonderplugin.com/wp-content/plugins/wonderplugin-lightbox/images/demo-image1.jpg";
    div.html(image);
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
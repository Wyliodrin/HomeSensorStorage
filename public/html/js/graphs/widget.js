/**
 * Created by victor-vm on 3/12/2015.
 */
widgets = dictionary ();
//{signal: [[timestamp, value],...] }
signalDatabase = dictionary();
firstTimestamp = 0;

var mustUpdate = false;

function Widget ()
{
    this.id = 'widget';
    this.name =  'Widget';
    this.description = 'Widget';
    // this.key = '';
    // Widget.prototype.signals = [];
    this.nsmin = 1;
    this.nsmax = '*';
    this.parameters = {
    };
    this.style = 'background-color: #ffffff',
        this.element = 'div';
    this.data = [10,4,17];

    this.mustUpdate = false;

    //mod victor 13.03.2015
    this.lastValueElement=null;
}

Widget.prototype.setDescription=function(description){
    this.description=description
}

Widget.prototype.setLatestValueElement=function(latestValueElement){
    this.lastValueElement=latestValueElement;
}

Widget.prototype.numberOfPoints = function ()
{
    return 1;
}

Widget.id = 'widget';

//[{"name": "signal", "value": {"component": value,}, "timestamp": 100}]
function addValues(data)
{
    // console.log (data);
    // console.log (data.ts);
    if (data.ts)
    {
        mustUpdate = true;
        // data.ts = parseFloat(data.ts);
        _.each (data.signals, function (value, name)
        {
            // addValueToDatabase (name, value, data.ts, data.text);
            nrs.forEach (function (widget)
            {
                // console.log (widget);
                widget.addValueToSignal (name.toLowerCase(), value, data.ts, data.text);
            });
        });
    }
    else
    {
        _.each (values, function (value, name)
        {
            // addValueToDatabase (name, parseFloat (value.v), parseFloat (value.ts));
        });
    }
}

function binarySearch(timestamp,componentValues)
{
    //make a binary search to find the correct position for the new timestamp
    var min = 0;
    var max = componentValues.length - 1;
    var indexToInsert = 0;

    while(min < max)
    {
        var middle = Math.floor((max + min) / 2);

        if( componentValues[middle][0] > timestamp )
        {
            max = middle - 1;
        }
        else if( componentValues[middle][0] < timestamp )
        {
            min = middle + 1;
        }
        else // componentValues[middle][0] == timestamp
        {
            indexToInsert = middle;
            break;
        }


        if( max == min || min > max ) indexToInsert = min;
    }

    return indexToInsert;
}

function getNewData(signalName,timestamp)
{
    var widgetSignal = signalDatabase[signalName];

    if( timestamp == 0 )
    {
        return widgetSignal;
    }
    else
    {
        var data = [];
        var index = binarySearch(timestamp,widgetSignal);
        for(var i=index+1;i<widgetSignal.length;i++)
        {
            data.push(widgetSignal[i]);
        }
        return data;
    }
}

function addValueToDatabase(signal,value,timestamp, text)
{

    var signal;
    if( !(signal in signalDatabase))
    {
        signalDatabase[signal] = [];
    }
    signal = signalDatabase[signal];

    //if there are no values for this component or if the last timestamp in database is less than the new timestamp
    if( signal.length == 0 || signal[signal.length - 1][0] < timestamp )
    {
        signal.push([timestamp,value, text]);
    }
    else
    {

        var indexToInsert = 0;
        var indexToInsert = binarySearch(timestamp,signal);


        if( signal[indexToInsert][0] > timestamp ) signal.splice(indexToInsert,0,[timestamp,value, text]);
        else signal.splice(indexToInsert+1,0,[timestamp,value]);


    }
}


Widget.prototype.resize = function (nr)
{
}

Widget.prototype.draw = function (nr, samples)
{
}

Widget.prototype.drawImage = function (id, width, height)
{
}

Widget.prototype.stopUpdating = function()
{

}

Widget.prototype.realtimeUpdate = function ()
{
    if (this.parameters.realtimeUpdate && this.parameters.realtimeUpdate.value)
    {
        this.update ();
    }
}

Widget.prototype.update = function()
{

}

Widget.prototype.addSignal = function (signal)
{
    signal.name = signal.name.toLowerCase ();
    if (_.isNumber (this.nsmax) && this.signals.length < this.nsmax || this.nsmax == '*' && this.signalNr (signal.name)==-1)
    {
        this.signals.push (signal);
        if (this._addSignal) this._addSignal (signal);
    }
}

Widget.prototype.addValueToSignal = function (name, value, ts, text)
{
    var s = this.signalNr (name);
    if (s > -1)
    {
        this.addValueToSignalNr (s, value, ts, text);
    }
}

Widget.prototype.addDebugToSignal = function (name, value, ts)
{

}

Widget.prototype.addValueToSignalNr = function (nr, value, ts)
{

}

Widget.prototype.addDebugToSignalNr = function (nr, value, ts)
{

}

Widget.prototype.setSignalValue = function (nrsignal, key, value)
{
    if (key=='name') value = value.toLowerCase ();
    if (this._setSignalValue) this._setSignalValue (nrsignal, key, value);
    this.signals[nrsignal][key] = value;
}

Widget.prototype.setParameter = function (parameter, value)
{
    this.parameters[parameter].value = value;
}

Widget.prototype.removeSignal = function (nrsignal)
{
    if (this.nsmin < this.signals.length)
    {
        if (this._removeSignal) this._removeSignal (nrsignal);
        this.signals.splice (nrsignal, 1);
    }
}

Widget.prototype.signalLists = function ()
{
    var signalcolors = [];
    var signallabels = [];
    for (var signalindex in this.signals)
    {
        var signal = this.signals[signalindex];
        // console.log (signal);
        signalcolors.push (signal.color);
        signallabels.push (signal.name);
    }
    return {
        signalcolors: signalcolors,
        signallabels:signallabels
    };
}

Widget.prototype.addValues = function(inputSignal)
{
}

// verifies if the input signal should belong to this widget
Widget.prototype.signalBelongsHere = function(inputSignal)
{
    if(inputSignal == null)
        return false;

    for (var signalindex = 0; signalindex < this.signals.length; signalindex++)
    {
        var signal = this.signals[signalindex];
        var sn = signal["name"].toLowerCase();
        if (inputSignal == sn)
            return true;
    }
    return false;
}

Widget.prototype.signalNr = function(inputSignal)
{
    if(inputSignal == null)
        return -1;

    inputSignal = inputSignal.toLowerCase ();
    for (var signalindex = 0; signalindex < this.signals.length; signalindex++)
    {
        var signal = this.signals[signalindex];
        var sn = signal["name"];
        if (inputSignal == sn)
            return signalindex;
    }
    return -1;
}

Widget.prototype.toJSON = function ()
{
    var json = {
        id: this.id,
        name: this.name,
        description: this.description,
        key: this.key,
        signals: this.signals,
        parameters: {}
    };
    for (parametername in this.parameters)
    {
        json.parameters[parametername] = this.parameters[parametername].value;
    }
    // console.log ('json: '+json);
    return json;
}

Widget.prototype.readJSON = function (json)
{
    this.name = json.name;
    this.description = json.description;
    this.key = json.key;
    this.signals = json.signals;
    for (parametername in json.parameters)
    {
        if (this.parameters[parametername])
        {
            this.parameters[parametername].value = json.parameters[parametername];
        }
        else
        {
            // console.log ('Parameter '+parametername+' missing');
        }
    }
}

function registerWidget (Widget)
{
    widgets.set (Widget.id, Widget);
}

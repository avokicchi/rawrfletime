# rawrfletime

rawrfletime is a jquery/bootstrap plugin for timepicker goodness that works well with mobile, 
in modals, in tables, wherever you want to use it.

(in theory)

requirements right now; material design icons. jquery ui for position utility. momentjs. jquery. bootstrap 4. 

requirements when done will be: momentjs, jquery, bootstrap 4.

Usage:

```
<input type="text" id ="timepicker"/>
```

```javascript
$("#timepicker").rawrfletime({
	"24hours" : true,//has an impact on set command
	"displayFormat" : timeFormat,//format to display in the linked textbox
	"valueFormat" : "HH:mm",//format to use for getting/setting data
	"constraint" : "#some-element"//position the timepicker so that it is always visible within this element
});	
```

You can give the input a value, but you can also dynamically set a new value:

```javascript
$("#timepicker").rawrfletime("set","18:23");//this works, if "24hours" is set to true.
```

Getting the picker's value:

```javascript
$("#timepicker").rawrfletime("get");//returns the timepicker's value, in the valueformat you configured.
```

Catching when a new value is set:

```javascript
container.find("input").on("set.rawrfletime",function(event,formattedValue,momentOBject){
	alert("it is now set");
});
```

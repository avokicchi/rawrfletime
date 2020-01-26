/*!
* jquery.rawrfletime.js
* https://github.com/lieuweprins/jquery-rawrfletime
* Copyright (c) 2019 Lieuwe Prins
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
*/

/*
create timepicker control for bootstrap 4. simple positioned control, with 12 hour and 24 hour support, and a method to get its value. nothing more, nothing less.
*/

//requirements: material design icons. jquery ui for position utility. momentjs. jquery. bootstrap 4. 

(function( $ ) {
 
    $.fn.rawrfletime = function( action, param ) {
    	var plugin = this;

    	plugin.closePicker = function(){
    		this.$pickerHolder.hide();
    		document.removeEventListener('mousedown', this.clickListener)
    	};

    	plugin.openPicker = function(){
    		var self=this;
    		if(this.$pickerHolder.is(":visible")) return;

    		if(this.inputTime!==null){//set picker to input value if any
    			this.pickerTime=moment(this.inputTime);
    		} else {
    			this.pickerTime=moment();
    		}
    		plugin.updatePopup.call(self);

    		if(this.inputTime!==null) console.warn("picker is open, input time is currently ", this.inputTime.format("HH:mm"));
    		console.warn("picker is open, picker time is currently ", this.pickerTime.format("HH:mm"));
    		this.$pickerHolder.show();
    		this.clickListener = function(e){
    			if($(e.target).hasClass("rawrfle-picker")) return;
    			if($(e.target).closest(".rawrfle-picker").length>0) return;

    			plugin.closePicker.call(self);
    		};
    		window.addEventListener("mousedown", this.clickListener);//, true);

			this.$pickerHolder.position({
			  my: "left top",
			  at: "left bottom",
			  of: self,
			  within: this.settings.constraint
			});
			 

    	};

    	//date was approved by clicking check. transfer picker time to input.
    	plugin.updateInput = function(){
    		console.log("plugin.updateInput");
			this.inputTime = moment(this.pickerTime);
			this.value = this.inputTime.format(this.settings.displayFormat);
    	};

    	//update picker time using input boxes.
    	plugin.updatePickerTime = function(){
    		console.log("plugin.updateInput");
    		if($(this).hasClass("suppress-changes")) return;
			var hours = this.$pickerHolder.find("input[name=hours]").val();
			hours = ('0' + hours).slice(-2);
			var minutes = this.$pickerHolder.find("input[name=minutes]").val();
			minutes = ('0' + minutes).slice(-2);

			if(this.settings["24hours"]==true){
				var timeString = hours + ":" + minutes;
				var parsedDate = moment(timeString, "HH:mm");
			} else {
				var ampm = this.$pickerHolder.find("select[name=ampm]").val();
				var timeString = hours + ":" + minutes + " " + ampm;
				var parsedDate = moment(timeString, "hh:mm a");
			}

			if(parsedDate.isValid()){
				this.pickerTime = parsedDate;
				plugin.updatePopup.call(this);//format nicely with zeros and all
			} else {
				console.warn("you're entering rubbish!");
				plugin.updatePopup.call(this);//go back! 
			}
    	};

    	//redraw the popup input fields content based on the picker time
    	plugin.updatePopup = function(){
    		console.log("plugin.updatePopup");
    		$(this).addClass("suppress-changes");
    		if(this.settings["24hours"]==true){
				this.$pickerHolder.find("input[name=hours]").val(this.pickerTime.format("HH"));
	    		this.$pickerHolder.find("input[name=minutes]").val(this.pickerTime.format("mm"));
    		} else {
	    		this.$pickerHolder.find("input[name=hours]").val(this.pickerTime.format("hh"));
	    		this.$pickerHolder.find("input[name=minutes]").val(this.pickerTime.format("mm"));
	    		this.$pickerHolder.find("select[name=ampm]").val(this.pickerTime.format("A"));
	    	}
    		$(this).removeClass("suppress-changes");
    	};

    	if ( action === "get") {
    		var currentPicker = this[0];//get dom object

			if(!$(currentPicker).hasClass("active-rawrfletime")) {
                console.error("The element you are running this command on is not a rawrfletime picker.");
                return false;//can't start if not initialized.
            }

            if(currentPicker.inputTime==null){
            	return null;
            } else {
            	if(currentPicker.inputTime.isValid()){
            		return currentPicker.inputTime.format(currentPicker.settings.valueFormat);
       			} else {
       				return null;
       			}
            }
            //TODO: return values or w/e
        } else if ( action === "set") {
        	var currentPicker = this[0];//get dom object

        	if(!$(currentPicker).hasClass("active-rawrfletime")) {
                console.error("The element you are running this command on is not a rawrfletime picker.");
                return false;//can't start if not initialized.
            }

		    if(currentPicker.settings["24hours"]==true){
        		var parsedDate = moment(param, "HH:mm");
    		} else {
        		var parsedDate = moment(param, "hh:mm A");
    		}

        	if(parsedDate.isValid()){
        		currentPicker.pickerTime = parsedDate;//is transfered to inputTime later
        		plugin.updateInput.call(currentPicker);
        	}
        	return;
        }


        //Initialize each timepicker in selectop.
		this.each(function() {

			var currentPicker = this;	

			if ( action === "destroy" ) {
	        	if(!$(currentPicker).hasClass("active-rawrfletime")) {
                    console.error("The element you are running this command on is not a rawrfletime picker.");
                    return false;//can't destroy if not initialized.
                }

                $(currentPicker).off("focus.rawrfletime");

				//reset css and visuals

	    		$(currentPicker).removeClass("active-rawrfletime");
	        } else if ( action === "close" ) {
	        	if(!$(currentPicker).hasClass("active-rawrfletime")) {
                    console.error("The element you are running this command on is not a rawrfletime picker.");
                    return false;//can't destroy if not initialized.
                }

                plugin.closePicker.call(currentPicker);
                
	        } else if ( typeof action == "object" || typeof action =="undefined" ){//not an action, but an init call
	        	
				if($(currentPicker).hasClass("active-rawrfletime")) return false;//prevent double init
				currentPicker.className = currentPicker.className + " active-rawrfletime";

				currentPicker.pickerTime=null;//time of the picker
				currentPicker.inputTime=null;//time of the input - selected and approved time.

	        	//determine settings
		    	var defaultSettings = {
		    		"24hours" : true,
		    		"displayFormat" : "HH:mm",
		    		"valueFormat" : "HH:mm",
		    		"constraint": window
		    	};
	        	if(typeof action == "object") defaultSettings = Object.assign(defaultSettings, action);
	        	currentPicker.settings = defaultSettings;

	        	if(currentPicker.value!==""){//oh! we have an initial value? try to parse
	        		if(currentPicker.settings["24hours"]==true){
		        		var parsedDate = moment(currentPicker.value, "HH:mm");
	        		} else {
		        		var parsedDate = moment(currentPicker.value, "hh:mm A");
	        		}
		        	if(parsedDate.isValid()){
		        		currentPicker.pickerTime = parsedDate;//is transfered to inputTime later
		        		plugin.updateInput.call(currentPicker);
		        	}
	        	}

	        	//set up special effects layer
				currentPicker.$pickerHolder=$(
					`<div class='rawrfle-picker' style='position:absolute;background:#fff;border-bottom-right-radius: 5px;    border-bottom-left-radius: 5px;z-index:999;background:fff;width:auto;display:flex;padding:15px;box-shadow: 0px 0px 2px 1px rgba(0,0,0,0.1);'>
						<div style="position:absolute;width: 0; height: 0;  border-left: 8px solid transparent; border-right: 8px solid transparent;border-bottom: 8px solid #eee;margin-top:-23px;"></div>
						<div style="display:flex;flex-direction:column;margin-right:5px;">
							<a class="btn btn-default up btn-raised"><i class="mdi mdi-chevron-up"></i></a>
							<input type='text' class="form-control" inputmode='numeric' name="hours" style='width:50px;'/>
							<a class="btn btn-default down btn-raised"><i class="mdi mdi-chevron-down"></i></a>
						</div>
						<div style="display:flex;flex-direction:column;margin-right:5px;">
							<a class="btn btn-default up btn-raised"><i class="mdi mdi-chevron-up"></i></a>
							<input type='text' class="form-control" inputmode='numeric' name="minutes" style='width:50px;'/>
							<a class="btn btn-default down btn-raised"><i class="mdi mdi-chevron-down"></i></a>
						</div>
						<div style="display:flex;flex-direction:column;margin-right:5px;">
							<a class="btn btn-default" style="visibility:hidden;"><i class="mdi mdi-chevron-up"></i></a>
							<select class="form-control" name="ampm" style="margin-top: -2px;">
								<option value="AM">AM</option>
								<option value="PM">PM</option>
							</select>
						</div>
						<div style="display:flex;flex-direction:column;align-content:flex-end;margin-left:5px">
						<span style="flex:1;"></span>
						<a class="btn btn-sm btn-secondary btn-raised today" style="margin-bottom:5px;height:24px;line-height:15px;"><i class="mdi mdi-clock-outline"></i></a>
						<a class="btn btn-sm btn-primary btn-raised check" style="height:24px;line-height:15px;color:#fff;"><i class="mdi mdi-check"></i></a>
						</div>
					</div>`);
				currentPicker.$pickerHolder.appendTo($(document.body));

				if(this.settings["24hours"]==true){
					currentPicker.$pickerHolder.find("select[name=ampm]").hide();
				}

	        	//plugin.updatePopup.call(currentPicker);no longer needed, it updates upon open

				currentPicker.$pickerHolder.find("input[name=hours],input[name=minutes],select[name=ampm]").on("change.rawrfletime",function(){
	        		plugin.updatePickerTime.call(currentPicker);
				});
				currentPicker.$pickerHolder.find(".up:first").on("click",function(){
	        		if(this.pickerTime!==null){
	        			currentPicker.pickerTime.add(1,"hours");
	        			plugin.updatePopup.call(currentPicker);
	        		}
				});
				currentPicker.$pickerHolder.find(".up:last").on("click",function(){
	        		if(this.pickerTime!==null){
	        			currentPicker.pickerTime.add(1,"minutes");
	        			plugin.updatePopup.call(currentPicker);
	        		}
				});
				currentPicker.$pickerHolder.find(".down:first").on("click",function(){
	        		if(this.pickerTime!==null){
	        			currentPicker.pickerTime.subtract(1,"hours");
	        			plugin.updatePopup.call(currentPicker);
	        		}
				});
				currentPicker.$pickerHolder.find(".down:last").on("click",function(){
	        		if(this.pickerTime!==null){
	        			currentPicker.pickerTime.subtract(1,"minutes");
	        			plugin.updatePopup.call(currentPicker);
	        		}
				});
				currentPicker.$pickerHolder.find(".check").on("click",function(){
    				plugin.updateInput.call(currentPicker);
    				plugin.closePicker.call(currentPicker);

    				var the_value=null;
					if(currentPicker.inputTime!==null){
						if(currentPicker.inputTime.isValid()){
							the_value = currentPicker.inputTime.format(currentPicker.settings.valueFormat);
						}
					}

    				$(currentPicker).trigger("set.rawrfletime",[the_value,currentPicker.inputTime]);
				});

				currentPicker.$pickerHolder.find(".today").on("click",function(){
    				currentPicker.pickerTime = moment();
	        		plugin.updatePopup.call(currentPicker);
				});

				currentPicker.$pickerHolder.hide();

				//$(currentPicker).attr("readonly","readonly");

				currentPicker.plugin = plugin;

	        	//set up canvas
	        	$(currentPicker).on("focus.rawrfletime",function(){
	        		plugin.openPicker.call(currentPicker);
	        		$("input").blur();
	        	});

	        	//bind events hier
			}
		});
		return this;
 
    };

 
}( jQuery ));
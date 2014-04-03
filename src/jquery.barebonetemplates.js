(function($) {
	function replace_elements(em, item) {
		for(var prop in item) {
			var inner = $(em).find('.' + prop);
			inner.each(function(){
				inner = $(this);
				if (inner.is('a')) {
					if (inner.hasClass('ajax')) {
						inner.attr('onclick', item[prop]);
					} else {
						inner.attr('href', item[prop]);
					}
				} else if (inner.is('form')) {
					inner.attr('action', item[prop]);
				} else if (inner.is('input[type=text]')) {
					inner.val(item[prop]);
				} else if (inner.is('img')) {
					inner.attr('src', item[prop]);
				} else {
					inner.html(item[prop]);
				}
			});
		}
		return em;
	}
    $.fn.extend({
		replaceElements: function(item) {
			return this.each(function() { replace_elements(this, item); });
		},
		exists: function() { return this.length > 0; },
        make_template: function(each_function) {
			var item = $(this).detach();
			var id = $(this).attr('id');
			$(this).attr('id', '');
			return {
				name: id,
				html: item,
				is_template: true,
				extend_function: each_function,
				apply_array: function(item, parent_em, ech) {
					item.id = item.id || item.Id;
					if (typeof item.id == "string"){
						item.id = item.id.toLowerCase().split(" ").join("_");
					}
					ech && console.log('#' + this.name + "_" + item.id);
					var em = $('#' + this.name + "_" + item.id);
					if (em.exists()) {
						ech && console.log("Found", item.id);
						var old_obj = em.data('obj');
						jQuery.extend(old_obj, item);
						em.data('obj', old_obj);
						em = replace_elements(em, item);
						if (parent_em) {
							if ( ! jQuery.contains(parent_em[0], em[0])){
								parent_em.append(em);
							}
						}
						if (undefined !== this.extend_function) {
							this.extend_function(em, item);
						}
						return em;
					} else {
						ech && console.log("Didn't find", item.id);
						em = $(this.html).clone();
						em.data('obj', item);
						if (undefined !== item.id)
						{
							em.attr('id', this.name + "_" + item.id); //just in case, since most of the time it will be Id
						}
						em = replace_elements(em, item);
						if (parent_em) {
							parent_em.append(em);
						}

						if (undefined !== this.extend_function) {
							this.extend_function(em, item);
						}
						return em;
					}
				}
			};
        },
        apply_template_advanced: function(options){
        	var calling_div = this;
			var settings = {
				template_outer: null,
				inner_template_holder: null, //Which class inside the outer template should we append to?
				template: null,
				post_function: null,
				post_outer_function: null,
				template_outer_id_addon: "",
				obj: null,
				overwrite: false,
				template_outer_class: 'Type', //if outer is not null, this is required (this becomes the ID)
				template_class: 'Type', //If template is an array, this is required
				ech: false
			};
			jQuery.extend(settings, options);
			var ech = settings.ech;
			if (settings.overwrite === true){
				ech && console.log("Clearing out calling div");
				calling_div.empty();
			}
			var has_outer = settings.template_outer !== null;
			var multi_templates = false;
			if (!settings.template.is_template){
				multi_templates = true;
			}
			ech && console.log("Settings.obj", settings.obj)
			for (var item in settings.obj) {
				if (settings.obj.hasOwnProperty(item)){
					ech && console.log("Item:", item);
					item = settings.obj[item];
					var outer_em = calling_div;  //if no outer this will stay
					if (has_outer){
						ech && console.log("Has outer em");
						var id = item[settings.template_outer_class] + settings.template_outer_id_addon;
						var id = id.toLowerCase();
						outer_em = settings.template_outer.apply_array({"id": id, "OriginalId": item[settings.template_outer_class]}, calling_div, ech);
						if (jQuery.isFunction(settings.post_outer_function)){
							settings.post_outer_function(outer_em, {"id": id});
						}

						if ( ! jQuery.contains(calling_div[0], outer_em[0])){ //if it's not already on the dom, let's add it
							calling_div.append(outer_em);
							ech && console.log("appending: ", id);
						}
						if (settings.inner_template_holder !== null){
							outer_em = outer_em.find(settings.inner_template_holder);
						}
					}
					var em;
					if (multi_templates){
						ech && console.log("Has multi templates");
						var which = item[settings.template_class];
						if (settings.template[which]){
							em = settings.template[which].apply_array(item, outer_em, ech);
						} else if(settings.template.Default){
							em = settings.template.Default.apply_array(item, outer_em, ech);
						} else {
							em = $("<div class='error'>Template doesnt have " + which + "</div>");
						}
					}else{
						ech && console.log("No multi templates");
						em = settings.template.apply_array(item, outer_em, ech);
					}
					ech && console.log("EM after apply_array", em);
					if (jQuery.isFunction(settings.post_function)){
						ech && console.log("Ready to run post function");
						settings.post_function(em, item);
						ech && console.log("Done running post function");
					}
				}
			}
			return calling_div;
		},
		apply_template_debug: function(template, json_array, overwrite) {
			return this.apply_template_advanced({template: template, obj: json_array, overwrite: overwrite, ech: true});
		},
		apply_template: function(template, json_array, overwrite) {
			return this.apply_template_advanced({template: template, obj: json_array, overwrite: overwrite, ech: false});
		},
		apply_layered_template: function(template_outer, template_inner, json_array, overwrite){
			return this.apply_template_advanced({template_outer: template_outer, template: template_inner, obj: json_array, overwrite: overwrite});
		}
	});
})(jQuery);

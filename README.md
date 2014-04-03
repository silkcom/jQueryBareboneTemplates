jQueryBareboneTemplates
=======================

Barebones Templating system written for jQuery

The main purpose of this new templating system is to be able to have an html/css dev create an example of a line, and then use javascript to clone the example and fill it in nicely.  It does very little for you that you don't want it to, but allows you to get as complex as you need, with basic javascript.


Available Methods:
  $.fn.make_template(each_function) - each_function should look like function(element, obj).  The element is the new element created by the template, and the object is what is passed in this time.  Make template returns an object that is passed to apply_template / apply_template_debug / apply_layered_template / apply_template_advanced and is used to create clones of the element it's called on.  Calling this on an element removes it from the dom.

  $.fn.apply_template(template, json_array, overwrite) - This is the default simple method.  You pass in a template object, an array of objects, and a flag.  The overwrite flag decide if you want to clear the containing div before adding the new elements.

  $.fn.apply_template_debug(template, json_array, overwrite) - This works exactly the same as apply_template except it outputs some debug as it does it's stuff.  This is mainly used by me when I find a bug and need to fix it (or you if you plan on helping me :)).

  $.fn.apply_layered_template(template_outer, template_inner, json_array, overwrite) - This is a more advanced function, but if you have everything setup just right this one is easier than the advanced function.

  $.fn.apply_template_advanced(options) - First thing to note is that all the other 3 methods call this method.  They create a quick options object and call this method with it.  

    Default Options:
      {
        inner_template_holder: null,  //Which class inside the outer template should we append to?
        template: null,               //This is a template object made by make_template
        template_class: 'Type',       //If template is an array, this is required
        post_function: null,          //This is a function that's run after the element is added and finished.  Rarely used
        template_outer: null,         //If null, then it will only do 1 layer
        template_outer_id_addon: "",  //If you're using the same outer template for multiple cases, you'll need to add a string to the id so that it doesn't conflict with others
        template_outer_class: 'Type', //if outer is not null, this is required (this becomes the ID of the outer obj)
        post_outer_function: null,    //post function for outer elements
        obj: null,                    //This is the json array
        overwrite: false,             //True = clear out parent element before we start
        ech: false                    //Debug mode - console.log statements in the code will be run
      };

  $.fn.replaceElements(item) - This is a simple helper, for those times that you don't want to make a template.  This will take an element and replace classes that match the items properties.


Examples:

Basic Usecase of make_template and apply_template
This will have 2 .item divs inside the .items div

    <div class='items'>
      <div id='item' class='item'>
        <span class="Name">Name</span>
        <span class="SKU">12345</span>
        <span class="open">Open</span>
      </div>
    </div>

    <script>
      var item_template = $('#item').make_template();
      var items = [{Id: 1, Name: "item1", SKU: "1234567"}, {Id: 2, Name: "item2", SKU: "2123535"}];
      $('.items').apply_template(item_template, items);
    </script>

Updating:
This will update the name of the #item_1 div from above.

    <script>
      var new_items = [{Id: 1, Name: 'item1.1'}];
      $('.items').apply_template(item_template, new_items);
    </script>

jQueryBareboneTemplates
=======================

Barebones Templating system written for jQuery

The main purpose of this new templating system is to be able to have an html/css dev create an example of a line, and then use javascript to clone the example and fill it in nicely.  It does very little for you that you don't want it to, but allows you to get as complex as you need, with basic javascript.

Examples:

Basic Usecase
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

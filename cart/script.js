// cart setup, 4re5 group, all rights reserved

function loading_svg() {
    document.getElementById("products_list").innerHTML = `
<svg style="width: 50px; height: 50px; transform-origin: center; animation: rotate4 2s linear infinite;" viewBox="25 25 50 50">
    <circle style="fill: none; stroke: hsl(214, 97%, 59%); stroke-width: 2; stroke-dasharray: 1, 200; stroke-dashoffset: 0; stroke-linecap: round; animation: dash4 1.5s ease-in-out infinite;" r="20" cy="50" cx="50"></circle>
</svg>`;
}


cart = document.getElementById("cart_view");

cart_list = document.getElementById("cart_list");

add_item_to_cart = document.getElementById("add_to_cart");

if(add_item_to_cart != null)
{
    add_item_quantity = document.getElementById("item_quantity").innerHTML;
    add_item_id = document.getElementById("item_id").value;
}

cart_content=sessionStorage.getItem("cart");

if(sessionStorage.getItem("products") != null && sessionStorage.getItem("products") != undefined && sessionStorage.getItem("products") != "")
    products = new Map(Object.entries(JSON.parse(sessionStorage.getItem("products"))));
else
    products = new Map();
subtotal=0;


// promo system
// fetch('https://raw.githubusercontent.com/4RE5group/4RE5group.github.io/main/promo/active')
//     .then(response => response.text())
//     .then(data => {
//         enabled=get_import_input("enabled", data);
//         message=get_import_input("message", data);

//         if(enabled == "true")
//         {
//             const promo = document.createElement('div');
//             promo.innerHTML = `<div style="width: 100%; height: 100vh; display: fixed; position: absolute"></div>`;
            
//             document.body.appendChild(promo);
//         }
//     });   
        

function get_product_by_id(id, key)
{
    temp_id=products.get(id);

    if(temp_id != undefined)
        return get_import_input(key, temp_id);
    else
        return "not found";
}

function load_cart()
{
    subtotal=0;
    items_in_cart=0;
    cart_content=sessionStorage.getItem("cart");
    cart = document.getElementById("cart_view");
    cart_list = document.getElementById("cart_list");

    var cart_content=sessionStorage.getItem("cart");


    if(cart_content != null && cart_content != undefined && cart_content != '' && cart_content != "undefined" && cart_content != "/" && cart_content != "//")
    {
        if(cart_content.startsWith("/"))
        {
            cart_content=cart_content.slice(1);
            sessionStorage.setItem("cart", cart_content);
        }
        cart.innerHTML = "";
        if(cart_list != null && cart_list != undefined)
        {
            cart_list.innerHTML = "";
        }
        
        var items = cart_content.split("/");
        items.forEach(process_item);
    }
    else
    {
        if(cart_list != null && cart_list != undefined)
        {
            cart_list.innerHTML=`<h1>Your cart is empty</h1>`;
        }
        cart.innerHTML=`<h1 style="display: flex; align-self: center;">Your cart is empty</h1>`;
    }
}

// items saved like that: item_id:quantity/item_id:quantity

function truncate(number) {
    var with2Decimals = number.toString().match(/^-?\d+(?:\.\d{0,2})?/);
    if (with2Decimals)
        return with2Decimals[0];
    return (0);
}

function get_subtotal()
{
    return truncate(parseFloat(subtotal), 3);
}

function get_quantity(id)
{
    quantity="0";
    id=id.replace("quantity_", "");
    id=id.replace("quantity2_", "");
    var cart_content=sessionStorage.getItem("cart");
    var items = cart_content.split("/");
    items.forEach(function (item) {
        // alert(item.split(":")[0]);
        // alert("'"+id+"'");
        if(item.split(":")[0] == id)
        {
            quantity = item.split(":")[1];
            return quantity;
        }
        
    });
    // alert("qtt: "+quantity);
    return quantity;
}

function goto_type(event)
{
    var text = event.target.options[event.target.selectedIndex].value;

    if(text == "all")
    {
        window.location = "./products.html";
    }
    else
    {
        window.location = "./products.html?type="+text;
    }
}

function change_quantity(event) {
    idchange=event.target.id.replace("quantity_", "");
    idchange=idchange.replace("quantity2_", "");
    //alert("id: "+idchange);
    //alert("delete_item("+idchange+", "+get_quantity(idchange)+");");
    delete_item(idchange, get_quantity(idchange));
    //alert("add_item("+idchange+", "+event.target.value+");");
    add_item(idchange, event.target.value);
    //alert("id: "+idchange);
    load_cart();
}
items_in_cart=0;
function process_item(item)
{
    items_in_cart++;
    document.getElementById("items_in_cart").innerHTML=items_in_cart;

    item_element = item.split(":");
    id=item_element[0];
    quantity=item_element[1];

    subtotal=truncate(Number(subtotal)+Number(quantity)*Number(get_product_by_id(id, "price")));
    document.getElementById("subtotal").innerHTML="$"+subtotal;

    if(document.getElementById("cart_subtotal") != null && document.getElementById("cart_subtotal") != undefined)
    {
        document.getElementById("cart_subtotal").innerHTML="$"+subtotal;
    }
    

    onclickvar="delete_item("+id+", Number(document.getElementById(`quantity_"+id+"`).value));";

    console.log("id: "+ id);

    cart.innerHTML+=`
<div class="" style="margin-bottom: 10px; width: 100%;height: 150px;display: flex;background: #1c1c1c;justify-content: center;text-align: center;align-content: center;border-radius: 20px;align-content: center;">
    <img src="`+get_product_by_id(id, "image")+`" style="width: 100px;height: 100px;margin-top: 25px;flex-direction: row;display: flex;">
    <div style="justify-content: center;text-align: center;display: flex;flex-direction: column;">
        <div style="width: 100%;justify-content: end;display: flex;"><img id="close_`+id+`" onclick="delete_item('`+id+`', '`+quantity+`')" src="assets/cross.png" style="width: 24px;height: 24px;position: relative;top: 0px;right: 0px;"></div>
    <h3>`+get_product_by_id(id, "name")+`</h3>
    <p>$`+get_product_by_id(id, "price")+`</p>
<div style="display: flex;margin-top: 10px;">
    <p>Quantity:</p>
    <input min="1" max="99" step="1" id="quantity_`+id+`" type="number" onchange="document.getElementById('close_`+id+`').onclick = '`+onclickvar+`'; change_quantity(event);" value="`+quantity+`" style="width: 50px;">
</div>
</div>
</div>`;
    
    if(cart_list != null && cart_list != undefined)
    {
        onclickvar2="delete_item("+id+", Number(document.getElementById(`quantity2_"+id+"`).value));";

        cart_list.innerHTML+=`<div id="cart_element" class="cart-container06">
              <div class="cart-container07">
                <img src="`+get_product_by_id(id, "image")+`" alt="image" class="cart-image">
                <div class="cart-container08">
                  <h1 class="cart-text08">`+get_product_by_id(id, "name")+`</h1>
                </div>
              </div>
              <div style="width: 100%; display: flex; font-size: 10px;">
                <div class="cart-container09">
                    <span class="cart-text09">$`+Number(get_product_by_id(id, "price"))+`</span>
                </div>
                <div class="cart-container10">
                    <input id="quantity2_`+id+`" onchange="document.getElementById('close2_`+id+`').onclick = '`+onclickvar2+`'; change_quantity(event);" type="number" placeholder="0" required="" min="1" max="99" step="1" value="`+quantity+`" class="cart-textinput input">
                    <svg width="30px" height="30px" id="close2_`+id+`" onclick="delete_item('`+id+`', '`+quantity+`')" viewBox="-0.5 0 19 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#9e1529"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g><g id="out" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <path d="M4.91666667,14.8888889 C4.91666667,15.3571429 5.60416667,16 6.0625,16 L12.9375,16 C13.3958333,16 14.0833333,15.3571429 14.0833333,14.8888889 L14.0833333,6 L4.91666667,6 L4.91666667,14.8888889 L4.91666667,14.8888889 L4.91666667,14.8888889 Z M15,3.46500003 L12.5555556,3.46500003 L11.3333333,2 L7.66666667,2 L6.44444444,3.46500003 L4,3.46500003 L4,4.93000007 L15,4.93000007 L15,3.46500003 L15,3.46500003 L15,3.46500003 Z" id="path" fill="#9e1529" sketch:type="MSShapeGroup"> </path> </g> </g></svg>
                </div>
                <div class="cart-container11">
                    <span id="pric" class="cart-text10">$`+Number(get_product_by_id(id, "price")) * Number(quantity)+`</span>
                </div>
              </div>
            </div>`;
    }

}

function clear_cart()
{
    subtotal=0;
    items_in_cart=0;
    document.getElementById("subtotal").innerHTML="$0";
    document.getElementById("items_in_cart").innerHTML="0";
    
    if(document.getElementById("cart_subtotal") != null && document.getElementById("cart_subtotal") != undefined)
    {
        document.getElementById("cart_subtotal").innerHTML="$0";
    }

    cart_content="";
    sessionStorage.clear();
    load_cart();
}

function delete_item(id, quantity)
{
    cart_content=sessionStorage.getItem("cart");
    if(cart_content == null || cart_content == undefined)
    {
        alert("already empty");
    }
    else
    {
        if(cart_content.length == id.length+":".length+quantity.length)
        {
            cart_content = cart_content.replace(id+":"+quantity, "");
        }

        if(cart_content.includes("/"+id+":"+quantity+"/"))
        {
            cart_content = cart_content.replace(new RegExp(id+":"+quantity+"/", ""));
        }
        else if(cart_content.startsWith(id+":"+quantity+"/"))
        {
            cart_content = cart_content.replace(new RegExp(id+":"+quantity+"/", ""));
        }
        else if(cart_content.endsWith("/"+id+":"+quantity))
        {
            cart_content = cart_content.replace(new RegExp(id+":"+quantity, ""));
        }
        
        cart_content = cart_content.replace(new RegExp("//", ""));
        cart_content = cart_content.replace("undefined/", "");
        cart_content = cart_content.replace("undefined", "");

        if(cart_content.endsWith("/"))
        {
            cart_content=cart_content.slice(0, -1);
        }

        sessionStorage.setItem("cart", cart_content);
        // alert(cart_content);
    }
    if(Number(subtotal)==NaN)
    {
        subtotal=0;
    }
    
    load_cart();
    document.getElementById("subtotal").innerHTML="$"+subtotal;
    document.getElementById("items_in_cart").innerHTML=items_in_cart;
    if(document.getElementById("cart_subtotal") != null) {
        document.getElementById("cart_subtotal").innerHTML="$"+subtotal;
    }
    
}

function add_item(id, quantity)
{
    cart_content=sessionStorage.getItem("cart");
    if(cart_content == null || cart_content == undefined || cart_content == "" || cart_content == " ")
    {
        sessionStorage.setItem("cart", id+":"+quantity);
    }
    else
    {
        sessionStorage.setItem("cart", cart_content+"/"+id+":"+quantity);
    }
    load_cart();
    confetti();
}

function get_import_input(name2, file2)
{
    result = "not found";
    importfile=file2.split("\r").join("");
    lines = importfile.split("\n");
    for (i = 0; i < lines.length; i++) 
    { 
        if(lines[i] == undefined)
        {}
        else
        {
            // get value from variable name 
            if(lines[i].startsWith(name2+": "))
            {
              result=lines[i].replace(name2+": ", "");
            }
        }
    }
    if(result == "not found")
    {
        console.log("Error at line "+i.toString()+": "+lines[i]);
    }
    return result;
}

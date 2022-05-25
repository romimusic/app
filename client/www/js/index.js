var dataArray = [];

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  
  //menu
  var menu = document.querySelector('.hamburger');

  // method
  function toggleMenu (event) {
    this.classList.toggle('is-active');
    document.querySelector( ".menuppal" ).classList.toggle("is_active");
    event.preventDefault();
  }
  
  // event
  menu.addEventListener('click', toggleMenu, false);

    //scanner function
  $("#scan").click(function () {
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        if (!result.cancelled) {
          alert("Barcode type is: " + result.format);
          alert("Decode text is: " + result.text);

          var data = JSON.parse(result.text);

          dataArray.push(data);
          localStorage.setItem("products", JSON.stringify(dataArray));
        } else {
          alert("You have cancelled scan");
        }
      },
      function (error) {
        alert("Scanninf failed: " + error);
      }
    );
  }); 

  //function to clean persistan and non persistan data
  function clearLocalData() {
    localStorage.clear();
    dataArray = [];
  }

  // event clik to clean the data
  $("#deleteLocalData").click(function () {
    clearLocalData();
  });

    //Send the data to the cloud
  $("#uploadData").click(() => {
    let store = JSON.parse(localStorage.getItem("products"));
    console.log("Hello, sending");
    console.log(typeof store);
    $.ajax({
      method: "POST",
      dataType: "json",
      url: "http://192.168.1.7:3000/postData",
      contentType: "application/json",
      data: JSON.stringify(store),
    })
      .done(function (data, tmpText, xhrObj) {
        alert(
          "Success: " +
            "The message is : " +
            data.msg +
            " The status text is : " +
            tmpText +
            "The status is: " +
            xhrObj.status
        );
      })
      .error(function (xhr) {
        alert("Error: " + JSON.stringify(xhr));
      })
      .complete(function (xhr) {
        alert("Complete: " + xhr);
        clearLocalData();
      }); // end ajax
  });

    //delete cloud data
    $("#deleteCloudData").click(function () {
        $.ajax({
            method: "POST",
            dataType: "json",
            url: "http://192.168.1.7:3000/postDeleteAll",
            contentType: "application/json",
          })
            .done(function (data, tmpText, xhrObj) {
              alert(
                "Success: " +
                  "The message is : " +
                  data.msg +
                  " The status text is : " +
                  tmpText +
                  "The status is: " +
                  xhrObj.status
              );
            })
            .error(function (xhr) {
              alert("Error: " + JSON.stringify(xhr));
            })
            .complete(function (xhr) {
              alert("Complete: " + xhr);
              clearLocalData();
            }); // end ajax
      });

 

}

function displayCloudData () {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.7:3000/getData",
        dataType: "json",
        success: function (result, status, xhr) {
  
          console.log(result);
          $("#bodyTable2").empty();
          if (result.length > 0) {
              result.forEach((product) => {
                let html = `
                              <tr>
                                  <td><img src="./Resources/${product.productCoverURL}" alt="${product.productCoverURL} width="200" height="200" > </td>
                                  <td>${product.productID} </td>
                                  <td>${product.productName} </td>
                                  <td>${product.productType} </td>
                                  <td>${product.productDescription} </td>
                              </tr>
                              `;
                $("#bodyTable2").append(html);
              });
            } else {
              $("#bodyTable2").append("Ohh no! there aren't cloud Data");
            }
        }, 
        error: function(xhr, status, error) {
            alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
        }
      })
}

//starting page 2 
$(document).on("pagebeforeshow", "#p2", function () {
  console.log("entre a la segunda pagina");

  $("#bodyTable").empty();
  let store = JSON.parse(localStorage.getItem("products"));
  store = typeof store === "undefined" || store === null ? [] : store;
  if (store.length > 0) {
    store.forEach((product) => {
      let html = `
                    <tr>
                        <td><img src="./Resources/${product.productCoverURL}" alt="${product.productCoverURL} width="200" height="200" > </td>
                        <td>${product.productID} </td>
                        <td>${product.productName} </td>
                        <td>${product.productType} </td>
                        <td>${product.productDescription} </td>
                    </tr>
                    `;

      $("#bodyTable").append(html);
    });
  } else {
    $("#bodyTable").append("Ohh no! there aren't Local Data");
  }
});

//starting page 3
$(document).on("pagebeforeshow", "#p3", function () {
    displayCloudData();
});
/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.00590841949779, "KoPercent": 1.9940915805022157};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7356466876971609, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea4ba893-baf4-43ff-9c65-0e4384404f25"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cb589492-dd54-44c2-ad82-3f6f2bee6027"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/721d940a-7cad-4716-814c-b19dbf530677"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39333af5-397d-477d-b6d7-6e1d030861a6"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8faa1757-3f8e-42c5-b77d-a1510217b769"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6b1e25de-add1-4bf3-b905-4f1179fe0772"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29996852-e032-4548-b217-0d6431625100"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a087d5c-373d-47e5-8edc-8fcf818b685b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a377b24b-f905-4fcc-a149-d9e37c9fe440"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f92e3d6a-5b92-44c8-9c67-be13cda3d39d"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e749653e-06fa-425e-8607-c7431bf77302"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f92e3d6a-5b92-44c8-9c67-be13cda3d39d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e33d9a8-7036-4fa3-9107-e3aff1809d31"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a377b24b-f905-4fcc-a149-d9e37c9fe440"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39333af5-397d-477d-b6d7-6e1d030861a6"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f09819d1-3525-47c6-8c7f-580a51d61a9b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/529b0fa4-424c-4655-96ae-86b6f328e387"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5aa654a-91c4-410c-8a3d-58b40229b4e5"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8faa1757-3f8e-42c5-b77d-a1510217b769"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b1e25de-add1-4bf3-b905-4f1179fe0772"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25862068965517243, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a087d5c-373d-47e5-8edc-8fcf818b685b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/29996852-e032-4548-b217-0d6431625100"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=721d940a-7cad-4716-814c-b19dbf530677"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e749653e-06fa-425e-8607-c7431bf77302"], "isController": false}, {"data": [0.288135593220339, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ea4ba893-baf4-43ff-9c65-0e4384404f25"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9346590909090909, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5aa654a-91c4-410c-8a3d-58b40229b4e5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f09819d1-3525-47c6-8c7f-580a51d61a9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=529b0fa4-424c-4655-96ae-86b6f328e387"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb589492-dd54-44c2-ad82-3f6f2bee6027"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1354, 27, 1.9940915805022157, 468.8663220088626, 138, 2547, 153.5, 1288.0, 1656.75, 2126.7500000000036, 5.259539227073031, 737.6452403282162, 3.849489298595384], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea4ba893-baf4-43ff-9c65-0e4384404f25", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb589492-dd54-44c2-ad82-3f6f2bee6027", 3, 0, 0.0, 926.6666666666666, 306, 1977, 497.0, 1977.0, 1977.0, 1977.0, 0.01963286541670757, 0.027065489921795752, 0.012590086221000621], "isController": false}, {"data": ["see books", 58, 0, 0.0, 2315.810344827587, 1709, 3094, 2278.0, 2848.3, 3052.25, 3094.0, 0.26182737450343085, 315.0666065705128, 1.2874031549070062], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/721d940a-7cad-4716-814c-b19dbf530677", 3, 0, 0.0, 575.3333333333334, 328, 1015, 383.0, 1015.0, 1015.0, 1015.0, 0.03169438164261415, 0.02576200226614829, 0.020324847602848268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39333af5-397d-477d-b6d7-6e1d030861a6", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 633.235294117647, 145, 1457, 501.0, 1270.6, 1457.0, 1457.0, 0.08566260021264481, 0.01720338064932251, 0.05750042988768121], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 633.235294117647, 145, 1457, 501.0, 1270.6, 1457.0, 1457.0, 0.08531780883792126, 0.017134137160924445, 0.05726899105417681], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8faa1757-3f8e-42c5-b77d-a1510217b769", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 201.07142857142856, 138, 421, 142.0, 421.0, 421.0, 421.0, 0.07268800232601606, 0.027247860246931526, 0.04101882943760254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 141.78571428571428, 139, 145, 141.5, 144.5, 145.0, 145.0, 0.07268687015529031, 0.05401826971501555, 0.03648540162091721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 210.92857142857142, 140, 832, 142.0, 626.0, 832.0, 832.0, 0.07268875712609423, 1.5448287628113935, 0.04235783182417628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b1e25de-add1-4bf3-b905-4f1179fe0772", 3, 0, 0.0, 778.0, 236, 1698, 400.0, 1698.0, 1698.0, 1698.0, 0.07077140835102619, 0.03202221927341354, 0.04538400861052135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 281.2142857142857, 139, 1541, 141.0, 984.0, 1541.0, 1541.0, 0.07268875712609423, 4.690011858976023, 0.04228684670979533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29996852-e032-4548-b217-0d6431625100", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 260.94117647058823, 141, 503, 244.0, 403.7999999999999, 503.0, 503.0, 0.08636324380343727, 0.16938269013884164, 0.055817604321718325], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a087d5c-373d-47e5-8edc-8fcf818b685b", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a377b24b-f905-4fcc-a149-d9e37c9fe440", 3, 0, 0.0, 394.0, 245, 648, 289.0, 648.0, 648.0, 648.0, 0.017386365612087, 0.023957189334623787, 0.011149459718688604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 216.86666666666667, 138, 432, 142.0, 427.8, 432.0, 432.0, 0.07223484994413838, 0.05368234453856378, 0.036258508663366336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 181.93333333333334, 140, 447, 142.0, 435.6, 447.0, 447.0, 0.07223519780404998, 0.03379440959764995, 0.04038775252221232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1024.7142857142858, 703, 1267, 1112.0, 1267.0, 1267.0, 1267.0, 0.05348165579206333, 15.725382560969088, 0.030501256818911113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1210.0000000000002, 958, 1535, 1245.0, 1535.0, 1535.0, 1535.0, 0.05354178936660063, 48.17699618849387, 0.0304832648444611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 309.7142857142857, 142, 451, 420.0, 451.0, 451.0, 451.0, 0.05394325169921243, 0.095454269608372, 0.029868968470169385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 179.73333333333335, 140, 423, 143.0, 420.6, 423.0, 423.0, 0.08944117156009254, 0.06646946441135784, 0.04489527556824958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 178.73333333333332, 139, 420, 141.0, 420.0, 420.0, 420.0, 0.08944277153334725, 0.02393292910169643, 0.051010330640112095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 179.79999999999998, 138, 433, 141.0, 424.6, 433.0, 433.0, 0.08928677722353838, 0.02406557667353183, 0.052490859266181744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 226.66666666666669, 140, 564, 143.0, 484.20000000000005, 564.0, 564.0, 0.08944117156009254, 0.024107190772056194, 0.05266897114329668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 147.71428571428572, 140, 163, 142.0, 163.0, 163.0, 163.0, 0.05394449881707421, 0.04008961289042331, 0.030291100409978188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 938.0526315789473, 140, 1950, 1247.0, 1801.0, 1950.0, 1950.0, 0.0883840145880142, 41.868174588083974, 0.04796250133738969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 410.2, 140, 1673, 144.0, 1585.4, 1673.0, 1673.0, 0.07214000933010788, 8.67174574914995, 0.04158383089900879], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f92e3d6a-5b92-44c8-9c67-be13cda3d39d", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 0.5772014776357828, 2.2027256389776357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 675.5263157894738, 139, 1395, 834.0, 1256.0, 1395.0, 1395.0, 0.08838524803691712, 13.689283114230957, 0.04804948440000372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 310.53333333333336, 138, 1121, 143.0, 949.4000000000001, 1121.0, 1121.0, 0.07213966238638003, 2.8450455081036887, 0.041654079798489875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e749653e-06fa-425e-8607-c7431bf77302", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 434.8235294117647, 144, 883, 450.0, 751.7999999999998, 883.0, 883.0, 0.0857226418709723, 0.017215438647800962, 0.058023316243432134], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f92e3d6a-5b92-44c8-9c67-be13cda3d39d", 3, 0, 0.0, 601.3333333333334, 486, 815, 503.0, 815.0, 815.0, 815.0, 0.0906043308870164, 0.04099610023859141, 0.05810238666908279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 427.1333333333333, 283, 984, 290.0, 906.0, 984.0, 984.0, 0.08921031033293288, 0.13825855712730906, 0.20063607880541448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e33d9a8-7036-4fa3-9107-e3aff1809d31", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 648.8181818181819, 250, 1760, 592.0, 1045.3, 1655.4499999999985, 1760.0, 0.09270769684583131, 0.05694642706643349, 0.041917640273066305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 157.3684210526316, 140, 424, 142.0, 147.0, 424.0, 424.0, 0.08838319230787121, 0.06568321225223632, 0.04436421957641192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 215.6842105263158, 139, 434, 143.0, 422.0, 434.0, 434.0, 0.08838483688345762, 0.09351820785787718, 0.04650016397713159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a377b24b-f905-4fcc-a149-d9e37c9fe440", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.25127129694019473, 0.9589055980528512], "isController": false}, {"data": ["login", 22, 0, 0.0, 2933.4545454545455, 1609, 4712, 2846.0, 4021.7, 4615.699999999999, 4712.0, 0.09205097950610466, 35.163993102191235, 0.18745253621369218], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 168.26666666666668, 143, 463, 147.0, 278.2000000000001, 463.0, 463.0, 0.07420526164775258, 0.060074376861315316, 0.02637765160134955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39333af5-397d-477d-b6d7-6e1d030861a6", 3, 0, 0.0, 350.6666666666667, 268, 436, 348.0, 436.0, 436.0, 436.0, 0.017359604201024215, 0.023931615817492695, 0.011132298266932848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1111.368421052632, 282, 2093, 1391.0, 1942.0, 2093.0, 2093.0, 0.08832526009464749, 55.67942953358452, 0.18675145068428833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 485.07142857142856, 282, 1683, 290.0, 1126.5, 1683.0, 1683.0, 0.07263294422827497, 6.311258714332037, 0.16202577821011674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 810.6923076923077, 141, 1681, 1098.0, 1620.6, 1681.0, 1681.0, 0.09921694930777097, 63.92654177415169, 0.15080797418069694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f09819d1-3525-47c6-8c7f-580a51d61a9b", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.5942896792763158, 2.2679379111842106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/529b0fa4-424c-4655-96ae-86b6f328e387", 3, 0, 0.0, 415.6666666666667, 227, 560, 460.0, 560.0, 560.0, 560.0, 0.024675313993370567, 0.02474760495233552, 0.015823687684550787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5aa654a-91c4-410c-8a3d-58b40229b4e5", 3, 0, 0.0, 342.0, 241, 494, 291.0, 494.0, 494.0, 494.0, 0.03522780648191639, 0.029367972786519494, 0.022590748297322688], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1114.5833333333333, 231, 2453, 1087.5, 1918.5, 2344.25, 2453.0, 0.09414533686378346, 0.02955832597822889, 0.0424757281553398], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 650.4666666666666, 282, 1960, 299.0, 1872.4, 1960.0, 1960.0, 0.07208973730499725, 11.596080113024692, 0.15967219745138747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 145.8125, 142, 154, 145.5, 152.6, 154.0, 154.0, 0.09521542489883361, 0.07392213163532492, 0.03384610806950726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8faa1757-3f8e-42c5-b77d-a1510217b769", 3, 0, 0.0, 348.0, 305, 423, 316.0, 423.0, 423.0, 423.0, 0.02693796187380463, 0.027016881683981787, 0.017274669561001012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 419.6875, 283, 727, 298.0, 617.8000000000001, 727.0, 727.0, 0.09746885565471658, 0.15105768937894062, 0.219209740793762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 168.54545454545453, 141, 421, 143.0, 366.6000000000002, 421.0, 421.0, 0.06572461386789352, 0.048844171048307586, 0.03299067532040749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 167.63636363636365, 139, 419, 141.0, 364.4000000000002, 419.0, 419.0, 0.06572265041524765, 0.02655979267491187, 0.03698066036326701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 280.81818181818176, 140, 1383, 143.0, 1190.2000000000007, 1383.0, 1383.0, 0.0657218650670363, 5.392162788952154, 0.03812381625958942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b1e25de-add1-4bf3-b905-4f1179fe0772", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 257.27272727272725, 139, 1125, 143.0, 983.6000000000005, 1125.0, 1125.0, 0.0657218650670363, 1.7728683150407474, 0.03818799776844394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 146.0, 144, 148, 146.0, 148.0, 148.0, 148.0, 0.02836638016622699, 0.008365866025586475, 0.0175350768019743], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1584.2068965517244, 1113, 2519, 1441.0, 2264.0, 2438.75, 2519.0, 0.2606765004629255, 311.859720368273, 0.5147342616562846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1114.5833333333333, 231, 2453, 1087.5, 1918.5, 2344.25, 2453.0, 0.09403504372629533, 0.029523697810550732, 0.04242596699369965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 168.45454545454547, 141, 420, 142.0, 366.6000000000002, 420.0, 420.0, 0.061753692590118286, 0.01664454995593032, 0.036364723273282544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 167.54545454545456, 139, 419, 142.0, 366.0000000000002, 419.0, 419.0, 0.061753692590118286, 0.01664454995593032, 0.03630441693286251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a087d5c-373d-47e5-8edc-8fcf818b685b", 3, 0, 0.0, 330.3333333333333, 227, 458, 306.0, 458.0, 458.0, 458.0, 0.045583006655118975, 0.029305481166621086, 0.02923129007506002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29996852-e032-4548-b217-0d6431625100", 3, 0, 0.0, 743.3333333333334, 244, 1093, 893.0, 1093.0, 1093.0, 1093.0, 0.017672840378905697, 0.024363437175997926, 0.011333169123191478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 228.5, 138, 434, 142.0, 424.2, 434.0, 434.0, 0.08958315836622716, 0.024145460653397163, 0.05266509896139526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 194.12500000000003, 140, 432, 141.0, 423.6, 432.0, 432.0, 0.08958265679764398, 0.02414532546498998, 0.05275228715720637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 160.375, 140, 424, 143.0, 231.5000000000002, 424.0, 424.0, 0.08958215523467726, 0.06657423841170838, 0.04496604276428136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 141.63636363636363, 139, 146, 142.0, 145.4, 146.0, 146.0, 0.061753692590118286, 0.016523937275090245, 0.035218902805301835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 212.125, 139, 421, 141.5, 419.6, 421.0, 421.0, 0.08958265679764398, 0.02397035933843208, 0.05109010895490633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 143.9090909090909, 141, 149, 145.0, 148.4, 149.0, 149.0, 0.06175230588724029, 0.04589209451190416, 0.030996762916056162], "isController": false}, {"data": ["deleteAccount", 17, 3, 17.647058823529413, 524.2941176470589, 142, 1093, 494.0, 1030.6, 1093.0, 1093.0, 0.08496856163219609, 0.016653994272119315, 0.05782040332576946], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 198.0, 142, 435, 147.0, 432.2, 435.0, 435.0, 0.06046281536854835, 0.04759084881547848, 0.021492641400538668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=721d940a-7cad-4716-814c-b19dbf530677", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1390.3636363636363, 957, 2547, 1360.5, 1785.0, 2438.5499999999984, 2547.0, 0.09331721490530423, 0.04829894912090942, 0.04292227365273271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 313.72727272727275, 283, 567, 287.0, 513.6000000000001, 567.0, 567.0, 0.06170311825122144, 0.0956277818991098, 0.13877175911383105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e749653e-06fa-425e-8607-c7431bf77302", 3, 0, 0.0, 380.3333333333333, 262, 500, 379.0, 500.0, 500.0, 500.0, 0.01802754609042617, 0.0248524276344254, 0.011560633397831886], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 1414.8813559322036, 711, 3054, 1114.0, 2572.0, 2798.0, 3054.0, 0.27951884857184817, 80.43210386494029, 1.0178638897179701], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ea4ba893-baf4-43ff-9c65-0e4384404f25", 3, 0, 0.0, 567.3333333333334, 236, 744, 722.0, 744.0, 744.0, 744.0, 0.05304476978569913, 0.033670996446000426, 0.03401633999929274], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 236.15517241379305, 140, 716, 145.0, 567.2, 589.1499999999999, 716.0, 0.26182028294647125, 0.19457542511939907, 0.12656351568213212], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 899.2931034482758, 694, 1420, 836.5, 1255.8, 1298.0499999999997, 1420.0, 0.261715136610789, 76.95293992396724, 0.1316243118696839], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 201.5344827586207, 139, 584, 145.0, 424.1, 427.05, 584.0, 0.26236864604207855, 0.46426951819164675, 0.12759725168843272], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1346.637931034483, 972, 1954, 1291.5, 1803.2, 1824.45, 1954.0, 0.2613872452037694, 235.19670270411865, 0.1312041445651733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 164.1875, 141, 422, 146.5, 233.7000000000002, 422.0, 422.0, 0.0996512207274539, 0.07444646860986547, 0.03542289486796213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, 4.545454545454546, 226.0795454545454, 140, 2029, 149.5, 344.4000000000002, 447.2500000000001, 1953.539999999999, 0.7518026176400232, 1.63182432407178, 0.3603625084898165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 198.90909090909093, 142, 430, 148.0, 428.8, 430.0, 430.0, 0.0654832065340334, 0.05071111599754736, 0.023277233572644686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 150.85714285714283, 142, 178, 147.5, 174.0, 178.0, 178.0, 0.07341296892533901, 0.059576344899371796, 0.026096016297679103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 451.09090909090907, 285, 1525, 290.0, 1388.2000000000005, 1525.0, 1525.0, 0.06566615327674105, 7.234295062651479, 0.14615732677567247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 444.74999999999994, 282, 843, 437.0, 654.7000000000002, 843.0, 843.0, 0.08951099027127424, 0.13872455230518774, 0.20131231503393027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 146.0, 140, 156, 144.0, 155.4, 156.0, 156.0, 0.08812643205452088, 0.07306576251395334, 0.03132619264438047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5aa654a-91c4-410c-8a3d-58b40229b4e5", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f09819d1-3525-47c6-8c7f-580a51d61a9b", 3, 0, 0.0, 663.6666666666666, 251, 1243, 497.0, 1243.0, 1243.0, 1243.0, 0.0670675817665601, 0.030346334197759943, 0.04300883335941517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 192.31578947368422, 143, 431, 150.0, 425.0, 431.0, 431.0, 0.09055208174470032, 0.07030166502640307, 0.03218843530768644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=529b0fa4-424c-4655-96ae-86b6f328e387", 1, 0, 0.0, 883.0, 883, 883, 883.0, 883.0, 883.0, 883.0, 1.1325028312570782, 0.20460256228765572, 0.7808076160815401], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb589492-dd54-44c2-ad82-3f6f2bee6027", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 0.28631388668779717, 1.0926356973058637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 143.62499999999997, 140, 153, 142.0, 150.9, 153.0, 153.0, 0.09755324273075915, 0.07249806417783956, 0.048967155042588084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 194.62500000000003, 140, 428, 142.0, 422.4, 428.0, 428.0, 0.0975538375240836, 0.026103272931248932, 0.05563617296295393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 273.74999999999994, 140, 584, 146.5, 469.9000000000001, 584.0, 584.0, 0.09755443232466114, 0.026293968087506326, 0.05735133619086525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 193.24999999999997, 139, 422, 141.0, 420.6, 422.0, 422.0, 0.09755502713249191, 0.026294128406804465, 0.05744695445399671], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.925925925925927, 0.51698670605613], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.11111111111111, 0.22156573116691286], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.11111111111111, 0.22156573116691286], "isController": false}, {"data": ["401/Unauthorized", 14, 51.851851851851855, 1.03397341211226], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1354, 27, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

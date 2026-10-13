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

    var data = {"OkPercent": 98.22940723633565, "KoPercent": 1.7705927636643572};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7414021164021164, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.07407407407407407, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a6c0e1c-7df0-4ddf-bc7d-1c7d0127b57d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f84f515e-45e6-41b8-9acc-1c07f6c35e83"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e1e7dd2-1a98-4d29-a2ea-486b6cd36a9e"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0c09d59-bf84-4154-83b4-802da302c223"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa2f07bc-4c68-49c4-b843-98b3e1f2fad6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52b6000b-734d-4943-a8cf-b59c35697589"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c72eda45-1864-4f45-9c1d-ac4d063c137a"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a6f1a61-205b-47c6-b355-c66ba47f3cf2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77ff4bac-e429-4d92-97c1-a593994b3945"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56b9a8a4-9b89-4640-9a2d-51e1b1f6f826"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=522e70d8-dda0-4f61-af7e-66ef49ee39f0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/068a85f0-3f09-41de-903c-dbd013945056"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0c09d59-bf84-4154-83b4-802da302c223"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/522e70d8-dda0-4f61-af7e-66ef49ee39f0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa2f07bc-4c68-49c4-b843-98b3e1f2fad6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f84f515e-45e6-41b8-9acc-1c07f6c35e83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/77ff4bac-e429-4d92-97c1-a593994b3945"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5150f986-db21-4e6b-a6dd-30ba6302119d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6ee9035-a44a-43ae-9cc8-d896db18c89d"], "isController": false}, {"data": [0.24166666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e1e7dd2-1a98-4d29-a2ea-486b6cd36a9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.867816091954023, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5150f986-db21-4e6b-a6dd-30ba6302119d"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/56b9a8a4-9b89-4640-9a2d-51e1b1f6f826"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4a6f1a61-205b-47c6-b355-c66ba47f3cf2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c72eda45-1864-4f45-9c1d-ac4d063c137a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/52b6000b-734d-4943-a8cf-b59c35697589"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e05f5fbc-4d64-4065-9e66-33835c749398"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=068a85f0-3f09-41de-903c-dbd013945056"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 23, 1.7705927636643572, 448.41724403387195, 98, 7861, 151.0, 1177.0, 1496.0, 3094.0, 5.111577191111601, 718.872999785542, 3.7383472997473723], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1944.018518518519, 1270, 4989, 1794.0, 2529.0, 2993.75, 4989.0, 0.23849904600381597, 286.99441704511827, 1.1726979459269664], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9a6c0e1c-7df0-4ddf-bc7d-1c7d0127b57d", 2, 0, 0.0, 287.5, 282, 293, 287.5, 293.0, 293.0, 293.0, 0.043094160741219564, 0.03808614792070675, 0.026786555968541265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f84f515e-45e6-41b8-9acc-1c07f6c35e83", 3, 0, 0.0, 334.6666666666667, 236, 442, 326.0, 442.0, 442.0, 442.0, 0.07126737142178406, 0.032246629647226514, 0.04570205784534981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e1e7dd2-1a98-4d29-a2ea-486b6cd36a9e", 3, 0, 0.0, 464.33333333333337, 222, 772, 399.0, 772.0, 772.0, 772.0, 0.0206287647495668, 0.024745116569711473, 0.013228732603075062], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 958.8571428571428, 112, 3205, 659.0, 2312.5, 3205.0, 3205.0, 0.06919218128351495, 0.013065236797884695, 0.046792564002767684], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 958.8571428571428, 112, 3205, 659.0, 2312.5, 3205.0, 3205.0, 0.06764592191727871, 0.012773263855334364, 0.045746875905972165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0c09d59-bf84-4154-83b4-802da302c223", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.18997272607781285, 0.7249769978969506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 143.21428571428572, 102, 334, 112.5, 324.0, 334.0, 334.0, 0.08797561818581706, 0.03297858343544789, 0.049645839224557765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 127.78571428571428, 104, 322, 113.5, 222.0, 322.0, 322.0, 0.08797672387248402, 0.06538113951851596, 0.044160191475055455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 287.5714285714286, 109, 862, 315.5, 602.0, 862.0, 862.0, 0.08785691873235017, 1.86719240272984, 0.051196756353937875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 230.99999999999997, 104, 1074, 115.0, 713.5, 1074.0, 1074.0, 0.08797672387248402, 5.676419498548384, 0.05118065548943337], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 545.5714285714287, 110, 3056, 377.5, 1847.0, 3056.0, 3056.0, 0.06874235855032186, 0.13518307563132492, 0.04443606561703632], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 111.83333333333333, 106, 117, 112.0, 116.7, 117.0, 117.0, 0.12251648867743452, 0.09104985144875748, 0.061497534355665365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 110.0, 103, 116, 111.0, 115.4, 116.0, 116.0, 0.12251648867743452, 0.06345173616074164, 0.06815777316072122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 787.0, 623, 903, 816.0, 903.0, 903.0, 903.0, 0.08052178114179885, 23.676077230453334, 0.045922578307432155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1032.5714285714284, 877, 1297, 1021.0, 1297.0, 1297.0, 1297.0, 0.0804264901879682, 72.36789724582357, 0.04578969119100142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 270.2857142857143, 102, 343, 332.0, 343.0, 343.0, 343.0, 0.08116130229106762, 0.14361746069474074, 0.04493990078030795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 124.88235294117648, 104, 332, 112.0, 163.19999999999985, 332.0, 332.0, 0.08198144325919639, 0.06092566242211763, 0.04115084163596381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 155.58823529411762, 104, 461, 111.0, 350.5999999999999, 461.0, 461.0, 0.08197986188804443, 0.021936017731761893, 0.04675413998302535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 145.88235294117646, 102, 331, 109.0, 320.59999999999997, 331.0, 331.0, 0.08197986188804443, 0.02209613464951198, 0.04819519224277613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa2f07bc-4c68-49c4-b843-98b3e1f2fad6", 1, 0, 0.0, 2400.0, 2400, 2400, 2400.0, 2400.0, 2400.0, 2400.0, 0.4166666666666667, 0.07527669270833334, 0.2872721354166667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 170.23529411764707, 104, 328, 110.0, 326.4, 328.0, 328.0, 0.081981838611517, 0.022096667438260442, 0.04827641472924292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 215.85714285714286, 105, 395, 118.0, 395.0, 395.0, 395.0, 0.0811537748098683, 0.06031056897491189, 0.04556974659733816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 688.7368421052632, 102, 1472, 921.0, 1286.0, 1472.0, 1472.0, 0.09186510334824126, 43.5171925994198, 0.04985155022361901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 285.41666666666663, 105, 1196, 113.0, 1110.5000000000002, 1196.0, 1196.0, 0.12251523783270545, 18.40075579777839, 0.07027078419961816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 488.2105263157896, 105, 926, 636.0, 910.0, 926.0, 926.0, 0.09186688005570035, 14.228525210205927, 0.04994222812238602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 253.75000000000003, 103, 904, 112.5, 880.3000000000001, 904.0, 904.0, 0.12252774742946998, 6.032058555499964, 0.07039761530371566], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 796.2307692307692, 116, 2400, 616.0, 1919.5999999999995, 2400.0, 2400.0, 0.06870600173350527, 0.013016566734667992, 0.04699279941282794], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 332.3529411764706, 216, 656, 233.0, 591.1999999999999, 656.0, 656.0, 0.08193600316176576, 0.1269848017751194, 0.1842759914858853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 1030.1363636363635, 139, 4364, 601.0, 2541.2999999999993, 4145.449999999997, 4364.0, 0.10045616230062876, 0.06170598250692919, 0.0454210968214757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 121.78947368421049, 105, 316, 112.0, 116.0, 316.0, 316.0, 0.09186510334824126, 0.06827084340626134, 0.04611197570409767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 167.05263157894734, 106, 347, 113.0, 344.0, 347.0, 347.0, 0.09186465918211444, 0.09720013743436512, 0.04833093397348496], "isController": false}, {"data": ["login", 22, 0, 0.0, 4165.136363636363, 2144, 9397, 3632.0, 7216.3, 9083.799999999996, 9397.0, 0.09810260640788389, 37.47574869428775, 0.19977606407883883], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 156.25, 112, 355, 118.0, 354.4, 355.0, 355.0, 0.11479408810446262, 0.09293388577988233, 0.0408057110058832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52b6000b-734d-4943-a8cf-b59c35697589", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.2932858157467533, 1.1192420860389611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c72eda45-1864-4f45-9c1d-ac4d063c137a", 3, 0, 0.0, 416.3333333333333, 384, 453, 412.0, 453.0, 453.0, 453.0, 0.039723524271073334, 0.025538398579221945, 0.025473744405603665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 812.9473684210527, 214, 1588, 1029.0, 1392.0, 1588.0, 1588.0, 0.09181582711562995, 57.87985079777081, 0.19413176809496654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a6f1a61-205b-47c6-b355-c66ba47f3cf2", 1, 0, 0.0, 1199.0, 1199, 1199, 1199.0, 1199.0, 1199.0, 1199.0, 0.8340283569641368, 0.1506789512093411, 0.5750234570475395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77ff4bac-e429-4d92-97c1-a593994b3945", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 0.6208387027491409, 2.3692547250859106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56b9a8a4-9b89-4640-9a2d-51e1b1f6f826", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=522e70d8-dda0-4f61-af7e-66ef49ee39f0", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 464.92857142857144, 220, 1186, 438.0, 923.5, 1186.0, 1186.0, 0.08779466083041207, 7.628698301094925, 0.19584774367721666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 999.1111111111111, 110, 1551, 1177.0, 1551.0, 1551.0, 1551.0, 0.10327496385376264, 96.10273277029353, 0.19633000940949671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/068a85f0-3f09-41de-903c-dbd013945056", 3, 0, 0.0, 619.3333333333334, 525, 695, 638.0, 695.0, 695.0, 695.0, 0.022128299882720012, 0.026154901326222772, 0.014190348557603653], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1504.1304347826083, 137, 4761, 1465.0, 2954.400000000002, 4503.599999999997, 4761.0, 0.09408338242031547, 0.029353120500359972, 0.04244777605291577], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f0c09d59-bf84-4154-83b4-802da302c223", 3, 0, 0.0, 572.6666666666666, 459, 790, 469.0, 790.0, 790.0, 790.0, 0.024806509228021432, 0.029320454103823508, 0.01590782004531322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 138.2941176470588, 109, 330, 119.0, 220.3999999999999, 330.0, 330.0, 0.0757379999821793, 0.05880049803303959, 0.026922492181165297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 417.49999999999994, 216, 1312, 228.5, 1225.9000000000003, 1312.0, 1312.0, 0.1223753046635189, 24.558616336848225, 0.27000645019834996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 392.08333333333337, 220, 649, 443.0, 615.7000000000002, 649.0, 649.0, 0.0914662032379036, 0.14175475052593067, 0.20570963482118357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/522e70d8-dda0-4f61-af7e-66ef49ee39f0", 3, 0, 0.0, 838.6666666666666, 371, 1609, 536.0, 1609.0, 1609.0, 1609.0, 0.026396367859782492, 0.0264737009687467, 0.01692735829549854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa2f07bc-4c68-49c4-b843-98b3e1f2fad6", 3, 0, 0.0, 507.3333333333333, 356, 735, 431.0, 735.0, 735.0, 735.0, 0.08743296805782234, 0.03956114114595477, 0.056068667667288415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 17, 0, 0.0, 122.70588235294117, 102, 330, 110.0, 163.59999999999985, 330.0, 330.0, 0.07618228179377905, 0.05661593402838462, 0.038239934416017994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 17, 0, 0.0, 131.2941176470588, 100, 320, 113.0, 258.3999999999999, 320.0, 320.0, 0.07618194039883486, 0.020384620770781986, 0.04344751288371051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 17, 0, 0.0, 131.11764705882356, 102, 328, 110.0, 246.39999999999992, 328.0, 328.0, 0.076185013063489, 0.02053424180226852, 0.04478845494552772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 17, 0, 0.0, 116.58823529411765, 104, 239, 110.0, 138.99999999999991, 239.0, 239.0, 0.07618569591151704, 0.020534425851151075, 0.04486325647914528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 2.5424299568965516, 5.329000538793103], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1229.7222222222222, 832, 1915, 1143.0, 1702.5, 1799.5, 1915.0, 0.2334418405592229, 279.2775988237125, 0.4609564468854968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1504.1304347826083, 137, 4761, 1465.0, 2954.400000000002, 4503.599999999997, 4761.0, 0.09449349432833613, 0.029481071515141555, 0.04263280701141728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 147.0, 107, 318, 115.0, 318.0, 318.0, 318.0, 0.05531942357160638, 0.014910313384534534, 0.03257579337273306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f84f515e-45e6-41b8-9acc-1c07f6c35e83", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 112.0, 104, 116, 113.5, 116.0, 116.0, 116.0, 0.05531789349461572, 0.014909900980970645, 0.032520870980233076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 261.94117647058823, 106, 1201, 112.0, 1157.0, 1201.0, 1201.0, 0.07912128828074094, 8.39451961451643, 0.045714724122684534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 199.88235294117646, 105, 866, 113.0, 857.2, 866.0, 866.0, 0.0791216565282348, 2.7558043879939866, 0.045792204131546735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 128.23529411764707, 108, 349, 114.0, 170.59999999999985, 349.0, 349.0, 0.07911723778453118, 0.05879708784573069, 0.0397131447473135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 148.83333333333331, 105, 330, 115.0, 330.0, 330.0, 330.0, 0.05531687349031032, 0.014801585289399444, 0.03154790441244261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 149.58823529411765, 99, 334, 113.0, 329.2, 334.0, 334.0, 0.07912128828074094, 0.03515188669366098, 0.04434210067020385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 113.0, 105, 118, 115.0, 118.0, 118.0, 118.0, 0.05532044366995823, 0.041112165657068565, 0.027768269576522002], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 949.4615384615383, 111, 3809, 735.0, 2970.1999999999994, 3809.0, 3809.0, 0.07142817896604964, 0.01338205215905407, 0.04861322877346828], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 683.3333333333333, 116, 3103, 126.5, 3103.0, 3103.0, 3103.0, 0.054193198753556424, 0.04265597480016258, 0.01926398861942826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77ff4bac-e429-4d92-97c1-a593994b3945", 3, 0, 0.0, 819.0, 261, 1712, 484.0, 1712.0, 1712.0, 1712.0, 0.05925106651919735, 0.027465338126086272, 0.03799628940195924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2445.863636363637, 1189, 7861, 1959.0, 3873.4999999999995, 7278.849999999991, 7861.0, 0.10151487885122071, 0.05254188065541697, 0.0466928788466064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 265.33333333333337, 224, 447, 230.5, 447.0, 447.0, 447.0, 0.055261849061469595, 0.08564507271538306, 0.1242851937388325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5150f986-db21-4e6b-a6dd-30ba6302119d", 3, 0, 0.0, 1436.0, 239, 3809, 260.0, 3809.0, 3809.0, 3809.0, 0.01918060457265613, 0.02644201183762979, 0.012300062177126491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6ee9035-a44a-43ae-9cc8-d896db18c89d", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["addBook", 60, 11, 18.333333333333332, 1436.433333333334, 567, 4818, 1074.5, 2609.2, 3681.4499999999994, 4818.0, 0.2825071568479735, 85.61908169577276, 1.0269438625908731], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 206.68518518518513, 105, 587, 115.5, 449.5, 470.25, 587.0, 0.23458983704694839, 0.17433873632102317, 0.11340036068187447], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 699.1666666666664, 512, 1017, 659.0, 916.0, 997.0, 1017.0, 0.2345124096150088, 68.95443497166309, 0.11794325288254838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e1e7dd2-1a98-4d29-a2ea-486b6cd36a9e", 1, 0, 0.0, 1101.0, 1101, 1101, 1101.0, 1101.0, 1101.0, 1101.0, 0.9082652134423251, 0.16409088328792007, 0.6262062897366031], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 185.75925925925924, 103, 457, 115.5, 347.0, 434.0, 457.0, 0.2349624060150376, 0.41577332001879697, 0.11426882636278195], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1017.4999999999999, 699, 1465, 1015.5, 1228.5, 1311.0, 1465.0, 0.23392522190406465, 210.48632586595653, 0.11741949615106372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 199.75, 114, 797, 120.5, 661.7000000000005, 797.0, 797.0, 0.09258044855227324, 0.06916410463133695, 0.03290945632131588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, 6.32183908045977, 293.9367816091953, 104, 3273, 121.0, 560.5, 813.75, 3138.75, 0.6974171516521572, 1.4944742717201354, 0.3363670916802944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 17, 0, 0.0, 300.52941176470586, 107, 1420, 118.0, 1115.1999999999998, 1420.0, 1420.0, 0.07946784590717221, 0.061541017387097226, 0.02824833584981512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 116.64285714285714, 109, 146, 115.5, 134.0, 146.0, 146.0, 0.08672919428578509, 0.07038277387840568, 0.030829518281275167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 0, 0.0, 259.4117647058824, 213, 659, 226.0, 417.3999999999998, 659.0, 659.0, 0.07614338246821015, 0.1180073710713374, 0.1712482517815312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5150f986-db21-4e6b-a6dd-30ba6302119d", 1, 0, 0.0, 850.0, 850, 850, 850.0, 850.0, 850.0, 850.0, 1.176470588235294, 0.21254595588235295, 0.8111213235294118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 407.11764705882354, 219, 1496, 237.0, 1352.8, 1496.0, 1496.0, 0.07907601996436928, 11.237829888002771, 0.17546354682695842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56b9a8a4-9b89-4640-9a2d-51e1b1f6f826", 3, 0, 0.0, 387.66666666666663, 218, 650, 295.0, 650.0, 650.0, 650.0, 0.027989513262364367, 0.028071513789500197, 0.01794900427306569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a6f1a61-205b-47c6-b355-c66ba47f3cf2", 3, 0, 0.0, 1479.0, 353, 3056, 1028.0, 3056.0, 3056.0, 3056.0, 0.02557348541032657, 0.02564840773086464, 0.016399663495554478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c72eda45-1864-4f45-9c1d-ac4d063c137a", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52b6000b-734d-4943-a8cf-b59c35697589", 3, 0, 0.0, 426.33333333333337, 241, 780, 258.0, 780.0, 780.0, 780.0, 0.04566349051721514, 0.029357224534993457, 0.029282902447563094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e05f5fbc-4d64-4065-9e66-33835c749398", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.7567202310426541, 1.4139329087677726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 186.76470588235293, 110, 926, 117.0, 438.79999999999956, 926.0, 926.0, 0.08696764292108965, 0.07210500863281749, 0.030914279319606087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 143.6842105263158, 105, 328, 120.0, 313.0, 328.0, 328.0, 0.09015720569603734, 0.0699950962190915, 0.03204806921226328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=068a85f0-3f09-41de-903c-dbd013945056", 1, 0, 0.0, 956.0, 956, 956, 956.0, 956.0, 956.0, 956.0, 1.0460251046025104, 0.188979144874477, 0.7211852771966527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 132.16666666666669, 100, 315, 110.0, 271.50000000000017, 315.0, 315.0, 0.0915436548804211, 0.0680319544570317, 0.04595062364114887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 155.16666666666666, 106, 344, 111.0, 341.0, 344.0, 344.0, 0.09155203588839807, 0.02449732210295026, 0.05221327046760202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 218.16666666666666, 105, 427, 147.5, 400.6000000000001, 427.0, 427.0, 0.09155552842799158, 0.024677076021607104, 0.05382463682973723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 236.91666666666666, 98, 423, 258.5, 397.80000000000007, 423.0, 423.0, 0.09155482989875562, 0.024676887746148977, 0.053913635184521136], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 34.78260869565217, 0.6158583525789069], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.3478260869565215, 0.07698229407236336], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07698229407236336], "isController": false}, {"data": ["401/Unauthorized", 13, 56.52173913043478, 1.0007698229407236], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 23, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 96.2992125984252, "KoPercent": 3.7007874015748032};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6995967741935484, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87334d8a-ac8b-483e-825b-fc5ded4bb2a3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/09316a78-ffc7-4668-b7b9-6bc4b33d8cee"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dcdc0999-fd93-46eb-b0b7-84cfbbaf770a"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2169811320754717, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.40625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.40625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e239c19c-cf10-45f4-97d2-d5766303ae51"], "isController": false}, {"data": [0.18, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09316a78-ffc7-4668-b7b9-6bc4b33d8cee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.59375, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6561f694-95b0-4a1c-b709-dcc611046563"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3246cfce-66f2-41b0-a5aa-e895154d1d0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=550f43b3-41f2-4b98-a004-77d70c0f1c38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/550f43b3-41f2-4b98-a004-77d70c0f1c38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6561f694-95b0-4a1c-b709-dcc611046563"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0059af8-7e3d-42d4-87d3-a01a00e17821"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.33962264150943394, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8711656441717791, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b0059af8-7e3d-42d4-87d3-a01a00e17821"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b939c61a-3c7f-4495-a7ae-fb3c2badb8c9"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3246cfce-66f2-41b0-a5aa-e895154d1d0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b939c61a-3c7f-4495-a7ae-fb3c2badb8c9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9a5ea68-1a74-4778-a843-71d14694ba5a"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7cdd137a-93da-4ff0-9d93-22d6a53dd81a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64a04336-fb27-4cc0-b633-c097e1cbe7d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cdd137a-93da-4ff0-9d93-22d6a53dd81a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b9a5ea68-1a74-4778-a843-71d14694ba5a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64a04336-fb27-4cc0-b633-c097e1cbe7d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87334d8a-ac8b-483e-825b-fc5ded4bb2a3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcdc0999-fd93-46eb-b0b7-84cfbbaf770a"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05263157894736842, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.18, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1270, 47, 3.7007874015748032, 494.84724409448813, 137, 3138, 156.0, 1396.6000000000004, 1707.3500000000001, 2296.379999999999, 4.9263950037820745, 699.2835309124013, 3.6097791183401537], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87334d8a-ac8b-483e-825b-fc5ded4bb2a3", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09316a78-ffc7-4668-b7b9-6bc4b33d8cee", 3, 0, 0.0, 1390.3333333333335, 459, 3127, 585.0, 3127.0, 3127.0, 3127.0, 0.02611898066324798, 0.021774319491724637, 0.016749476532095874], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2381.4528301886808, 1673, 3324, 2323.0, 2980.6, 3063.0, 3324.0, 0.24364119466931453, 293.1816532218675, 1.1979818507421862], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 169.33333333333337, 146, 451, 150.0, 205.30000000000038, 451.0, 451.0, 0.08614088820826953, 0.06687695910700613, 0.030620393855283305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 417.3684210526315, 280, 1007, 294.0, 581.0, 1007.0, 1007.0, 0.09581635534756122, 0.1484966366568161, 0.21549322887249364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcdc0999-fd93-46eb-b0b7-84cfbbaf770a", 3, 0, 0.0, 1065.0, 335, 2278, 582.0, 2278.0, 2278.0, 2278.0, 0.03549203795281925, 0.029588251691787144, 0.022760193609067034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 451.5625, 283, 1434, 297.5, 835.5000000000007, 1434.0, 1434.0, 0.09037556696547089, 6.888847805074024, 0.2018115535277538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 146.49999999999997, 144, 149, 147.0, 149.0, 149.0, 149.0, 0.03950344173736137, 0.02935753824426953, 0.019828876028323967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 179.125, 142, 423, 144.5, 423.0, 423.0, 423.0, 0.03945026061828421, 0.01055602676700183, 0.022498976758865214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 180.875, 142, 435, 145.0, 435.0, 435.0, 435.0, 0.03944831531038427, 0.010632553736002012, 0.02319129474301888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 144.25, 140, 147, 145.0, 147.0, 147.0, 147.0, 0.039505002320918886, 0.010647832656810168, 0.023263199608900477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 153.8, 147, 167, 152.0, 167.0, 167.0, 167.0, 0.06849784231796698, 0.02020151208986917, 0.042342904479758886], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1671.4339622641517, 1099, 2456, 1570.0, 2390.0, 2439.0, 2456.0, 0.24061051513349344, 287.85382584906006, 0.4751117789061755], "isController": false}, {"data": ["deleteBook", 16, 5, 31.25, 453.49999999999994, 147, 777, 524.0, 734.3000000000001, 777.0, 777.0, 0.09779472886411422, 0.02115980919331573, 0.06500747021844898], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, 31.25, 453.49999999999994, 147, 777, 524.0, 734.3000000000001, 777.0, 777.0, 0.0988172806719575, 0.021381058348516196, 0.06568719505604793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e239c19c-cf10-45f4-97d2-d5766303ae51", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.5743452113309352, 1.0731649055755395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 11, 44.0, 1143.72, 214, 2078, 1187.0, 1914.0, 2037.8, 2078.0, 0.09697627960200936, 0.029941426327120383, 0.04375296989856281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 165.99999999999997, 138, 432, 144.0, 319.9999999999999, 432.0, 432.0, 0.07632646590849045, 0.020423292635670293, 0.04352993758843595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 182.0, 140, 414, 144.0, 414.0, 414.0, 414.0, 0.06901243209669629, 0.01860100708856267, 0.040639156791316265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 144.99999999999997, 140, 147, 146.0, 147.0, 147.0, 147.0, 0.07632377720502327, 0.056721088333029995, 0.0383109584798652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 143.0, 140, 145, 143.0, 145.0, 145.0, 145.0, 0.06901583420424744, 0.018601924062863564, 0.0405737619052314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09316a78-ffc7-4668-b7b9-6bc4b33d8cee", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 207.6153846153846, 138, 430, 141.0, 427.6, 430.0, 430.0, 0.0763255696529535, 0.020572126195522625, 0.04494562353587008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 187.69230769230768, 142, 431, 143.0, 427.4, 431.0, 431.0, 0.07632422530911312, 0.020571763852846894, 0.04487029651961533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 261.94444444444446, 141, 1442, 144.0, 529.4000000000015, 1442.0, 1442.0, 0.08706082649744622, 4.374244452592961, 0.0507665887149822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 262.1111111111112, 139, 1152, 143.5, 505.80000000000103, 1152.0, 1152.0, 0.08706166868198308, 1.4443300332527207, 0.050852100967351876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 175.83333333333331, 140, 437, 144.5, 427.1, 437.0, 437.0, 0.08706040541128787, 0.06470016456834968, 0.043700242559962854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 182.42857142857142, 137, 424, 143.0, 424.0, 424.0, 424.0, 0.06901923664724267, 0.01846803793100048, 0.03936253340038059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 214.38888888888889, 137, 584, 144.0, 449.9000000000002, 584.0, 584.0, 0.08706124758767794, 0.03056023610526672, 0.04924590751677138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 143.57142857142858, 140, 146, 145.0, 146.0, 146.0, 146.0, 0.06901379289946662, 0.05128857069970127, 0.03464168901399008], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 662.0, 144, 3127, 558.0, 1795.6000000000008, 3127.0, 3127.0, 0.09646240217104712, 0.01966300658838207, 0.06563337012302171], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 150.7142857142857, 144, 158, 151.0, 158.0, 158.0, 158.0, 0.06024148228470125, 0.04741663547018477, 0.021413964405889895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1572.090909090909, 1020, 2950, 1477.0, 2230.6, 2855.4999999999986, 2950.0, 0.10465426037979983, 0.05416675586063858, 0.04813687171766183], "isController": false}, {"data": ["goToProfile", 16, 5, 31.25, 419.5, 141, 2424, 271.0, 1136.7000000000012, 2424.0, 2424.0, 0.0974706369706126, 0.15022162195708857, 0.06298349814501195], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 368.0, 288, 570, 291.0, 570.0, 570.0, 570.0, 0.06891323823306458, 0.1068020596444077, 0.1549874879401833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6561f694-95b0-4a1c-b709-dcc611046563", 3, 0, 0.0, 383.6666666666667, 274, 586, 291.0, 586.0, 586.0, 586.0, 0.022016894296890483, 0.030352066193792708, 0.014118906824503338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3246cfce-66f2-41b0-a5aa-e895154d1d0a", 3, 0, 0.0, 413.6666666666667, 270, 558, 413.0, 558.0, 558.0, 558.0, 0.02395706893247301, 0.02831644443157861, 0.015363094334951767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=550f43b3-41f2-4b98-a004-77d70c0f1c38", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 158.8947368421053, 139, 428, 145.0, 148.0, 428.0, 428.0, 0.09602409699444577, 0.07136165802028636, 0.048199595561665164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 143.2105263157895, 137, 148, 143.0, 147.0, 148.0, 148.0, 0.09602264112801334, 0.025693558270581694, 0.054762912518320106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 1089.7, 721, 1277, 1132.5, 1274.5, 1277.0, 1277.0, 0.0815461143276523, 23.97726519815706, 0.0465067683274892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1463.9, 1263, 1681, 1516.0, 1670.1000000000001, 1681.0, 1681.0, 0.08134975513723704, 73.19865267010233, 0.04631533910645429], "isController": false}, {"data": ["addBook", 55, 17, 30.90909090909091, 1387.3818181818176, 723, 4016, 1118.0, 2443.4, 2660.6, 4016.0, 0.2589478243674611, 68.6715009233844, 0.9418399508234541], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 229.2, 142, 438, 144.5, 437.3, 438.0, 438.0, 0.08209776201500747, 0.14527455544061868, 0.045458428771981675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 175.55555555555554, 142, 426, 145.0, 426.0, 426.0, 426.0, 0.04788099975527489, 0.03558343829469159, 0.024034017455284464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 206.2222222222222, 139, 429, 145.0, 429.0, 429.0, 429.0, 0.04788099975527489, 0.012811908137641914, 0.02730713267293021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 206.11111111111111, 140, 430, 143.0, 430.0, 430.0, 430.0, 0.047881509225170774, 0.012905563033346812, 0.028149090384328914], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 276.30188679245293, 139, 595, 149.0, 578.8, 584.9, 595.0, 0.24202570952348335, 0.1798648095189168, 0.11699484981848071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 265.77777777777777, 140, 429, 143.0, 429.0, 429.0, 429.0, 0.04788176396418444, 0.012905631693471588, 0.028195999678128143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/550f43b3-41f2-4b98-a004-77d70c0f1c38", 3, 0, 0.0, 412.3333333333333, 256, 583, 398.0, 583.0, 583.0, 583.0, 0.06388551715326135, 0.02890653282650823, 0.040968251559871376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6561f694-95b0-4a1c-b709-dcc611046563", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 976.1320754716979, 689, 1436, 985.0, 1236.4, 1330.4999999999998, 1436.0, 0.24149856695661684, 71.00859719235133, 0.12145679881118913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 202.8, 144, 432, 144.5, 431.4, 432.0, 432.0, 0.08220709611653677, 0.061093359516293445, 0.04616121119825063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0059af8-7e3d-42d4-87d3-a01a00e17821", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 226.09433962264154, 138, 583, 149.0, 435.0, 444.79999999999995, 583.0, 0.24227574636929225, 0.42871450431753666, 0.11782550946475345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 968.9444444444447, 140, 1827, 1274.5, 1722.6000000000001, 1827.0, 1827.0, 0.08849470506681349, 44.248207137220874, 0.04780019985054228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 202.89473684210526, 138, 431, 145.0, 426.0, 431.0, 431.0, 0.09588501872281155, 0.0258440089526328, 0.056369903585090385], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1393.169811320755, 953, 2312, 1293.0, 1828.6000000000001, 1854.3, 2312.0, 0.24130944521592643, 217.13066298204978, 0.12112603011815057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 706.6111111111112, 140, 1164, 1098.5, 1155.0, 1164.0, 1164.0, 0.0884968804849629, 14.466724097454732, 0.0478877976322168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 169.375, 147, 435, 149.0, 245.30000000000018, 435.0, 435.0, 0.09040007684006532, 0.0675352136549316, 0.032134402314241965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 240.94736842105263, 139, 578, 145.0, 436.0, 578.0, 578.0, 0.0958855026166649, 0.025844139377147964, 0.056463826247899356], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 446.43750000000006, 147, 1663, 446.5, 1035.8000000000006, 1663.0, 1663.0, 0.09904851520085182, 0.021431090477723368, 0.066082722147248], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 17, 10.429447852760736, 223.61963190184045, 140, 3138, 150.0, 429.0, 484.79999999999995, 1594.9599999999643, 0.6983838626197535, 1.5681251633489863, 0.3332377897971688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 185.125, 146, 436, 149.5, 436.0, 436.0, 436.0, 0.04039608359969501, 0.03128329520952944, 0.014359545342079087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 477.22222222222223, 288, 857, 566.0, 857.0, 857.0, 857.0, 0.04784383771370247, 0.07414860395668538, 0.10760191235806328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 147.6153846153846, 144, 154, 147.0, 153.2, 154.0, 154.0, 0.07692353209190586, 0.06242524918786502, 0.027343911798294665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0059af8-7e3d-42d4-87d3-a01a00e17821", 3, 0, 0.0, 1131.6666666666667, 328, 2424, 643.0, 2424.0, 2424.0, 2424.0, 0.0252654982777352, 0.025339518292220753, 0.01620215872628201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 694.3181818181818, 191, 1448, 711.5, 1275.6999999999998, 1429.8499999999997, 1448.0, 0.10607317120209832, 0.06515627410753891, 0.04796081861969875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 160.66666666666666, 138, 422, 145.0, 185.30000000000038, 422.0, 422.0, 0.08848817945402793, 0.06576123492628443, 0.04441691820251011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 235.55555555555557, 139, 436, 145.0, 426.1, 436.0, 436.0, 0.08849470506681349, 0.097520857710347, 0.04634065176350282], "isController": false}, {"data": ["login", 22, 0, 0.0, 3433.909090909091, 1536, 5518, 3633.0, 4402.9, 5359.599999999998, 5518.0, 0.10054798652656981, 54.808748517488496, 0.22749160481442043], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b939c61a-3c7f-4495-a7ae-fb3c2badb8c9", 3, 0, 0.0, 415.3333333333333, 272, 498, 476.0, 498.0, 498.0, 498.0, 0.04803381580632766, 0.02988041080920968, 0.030802935266427564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 329.375, 292, 579, 293.0, 579.0, 579.0, 579.0, 0.03941877023291566, 0.06109139488245815, 0.08865373813125464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 149.00000000000003, 144, 159, 148.0, 156.0, 159.0, 159.0, 0.09565042287555377, 0.07743574273811922, 0.034000736256544505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3246cfce-66f2-41b0-a5aa-e895154d1d0a", 1, 0, 0.0, 1663.0, 1663, 1663, 1663.0, 1663.0, 1663.0, 1663.0, 0.6013229104028863, 0.10863743986770896, 0.41458395971136497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b939c61a-3c7f-4495-a7ae-fb3c2badb8c9", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9a5ea68-1a74-4778-a843-71d14694ba5a", 1, 0, 0.0, 767.0, 767, 767, 767.0, 767.0, 767.0, 767.0, 1.303780964797914, 0.23554636571056062, 0.8988958604954368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 504.1111111111111, 284, 1879, 295.0, 961.0000000000015, 1879.0, 1879.0, 0.08699981150040842, 5.90967648606553, 0.19442796415607766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cdd137a-93da-4ff0-9d93-22d6a53dd81a", 3, 0, 0.0, 1014.6666666666667, 437, 2141, 466.0, 2141.0, 2141.0, 2141.0, 0.056808498551383285, 0.02570436620651783, 0.03642992908405764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64a04336-fb27-4cc0-b633-c097e1cbe7d9", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cdd137a-93da-4ff0-9d93-22d6a53dd81a", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9a5ea68-1a74-4778-a843-71d14694ba5a", 3, 0, 0.0, 576.6666666666666, 337, 908, 485.0, 908.0, 908.0, 908.0, 0.02089383840705376, 0.024695809653649807, 0.013398717988898407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64a04336-fb27-4cc0-b633-c097e1cbe7d9", 3, 0, 0.0, 582.6666666666666, 241, 1035, 472.0, 1035.0, 1035.0, 1035.0, 0.030868008396098285, 0.02573338850989834, 0.019794914238383338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 147.22222222222223, 145, 149, 147.0, 149.0, 149.0, 149.0, 0.05076084872139062, 0.042085898988731094, 0.018043895443931823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1147.111111111111, 283, 1966, 1422.0, 1867.9, 1966.0, 1966.0, 0.0884247137249893, 58.831295471180916, 0.18630020251715687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 197.22222222222223, 142, 432, 147.0, 432.0, 432.0, 432.0, 0.08823053658871335, 0.06849929354299523, 0.0313631985530192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87334d8a-ac8b-483e-825b-fc5ded4bb2a3", 3, 0, 0.0, 536.0, 270, 898, 440.0, 898.0, 898.0, 898.0, 0.02829387909082335, 0.023587442822786003, 0.018144186786758464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcdc0999-fd93-46eb-b0b7-84cfbbaf770a", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 398.8461538461538, 285, 579, 293.0, 577.4, 579.0, 579.0, 0.07625930510174751, 0.11818702851218095, 0.17150896450129346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 9, 47.36842105263158, 947.6315789473686, 141, 1955, 1407.0, 1840.0, 1955.0, 1955.0, 0.12587282869370503, 79.27261911958581, 0.18877689496574934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 143.75000000000003, 138, 150, 144.0, 147.9, 150.0, 150.0, 0.09059560951027411, 0.06732740120831894, 0.04547474930496181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 212.4375, 138, 437, 142.5, 432.1, 437.0, 437.0, 0.09045885252945567, 0.03269636991451638, 0.05111499369614871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 250.00000000000003, 137, 1287, 142.0, 686.4000000000005, 1287.0, 1287.0, 0.09045015913574873, 5.109556209474089, 0.05268898430124425], "isController": false}, {"data": ["register", 25, 11, 44.0, 1143.72, 214, 2078, 1187.0, 1914.0, 2037.8, 2078.0, 0.09661910430225548, 0.02983114845332138, 0.04359182244886917], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 278.0, 142, 1123, 145.5, 642.8000000000005, 1123.0, 1123.0, 0.0905961224859576, 1.687784086083303, 0.0528624835794528], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 23.404255319148938, 0.8661417322834646], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.638297872340425, 0.3937007874015748], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 8.51063829787234, 0.31496062992125984], "isController": false}, {"data": ["401/Unauthorized", 27, 57.4468085106383, 2.125984251968504], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1270, 47, "401/Unauthorized", 27, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

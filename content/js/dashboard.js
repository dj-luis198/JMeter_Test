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

    var data = {"OkPercent": 97.98549556809024, "KoPercent": 2.0145044319097503};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7446588559614059, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/be768e3e-4b98-43dc-8964-6a53b3438bb5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f0accfe2-b127-4b71-90d2-086acefa6626"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4eb0774a-4016-4809-99e9-6b00a6a12ba7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e4c38aa-0a4b-4438-809e-db0c5ca331ef"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a98078b-0a80-434d-9479-e5fd72680d39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/52942f32-2771-4e30-ae21-51a3effe1968"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de6dffc9-f857-4db7-bb7b-93db69777251"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48d264e8-241f-4c07-8ec8-9be67c65468e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cc34792-87ab-46ea-89b7-2f07c3e7d281"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/598213d9-528b-4a9e-ab90-b4ea0c5bc403"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d68c31b-d242-492a-94f3-7c159e48e075"], "isController": false}, {"data": [0.575, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be768e3e-4b98-43dc-8964-6a53b3438bb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=960f8473-5562-4137-a46e-a2f2222fd51b"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4eb0774a-4016-4809-99e9-6b00a6a12ba7"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52942f32-2771-4e30-ae21-51a3effe1968"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/037816c0-2130-4e8a-ac39-c9c175470296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3137254901960784, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d0cef53-ad55-40c6-a9ba-6b9707e03fa4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a98078b-0a80-434d-9479-e5fd72680d39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48d264e8-241f-4c07-8ec8-9be67c65468e"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.46078431372549017, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.911042944785276, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=598213d9-528b-4a9e-ab90-b4ea0c5bc403"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/de6dffc9-f857-4db7-bb7b-93db69777251"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2cc34792-87ab-46ea-89b7-2f07c3e7d281"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d0cef53-ad55-40c6-a9ba-6b9707e03fa4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d68c31b-d242-492a-94f3-7c159e48e075"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/960f8473-5562-4137-a46e-a2f2222fd51b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/aada61e1-a977-4bf6-ad81-18183d95cd47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0accfe2-b127-4b71-90d2-086acefa6626"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e4c38aa-0a4b-4438-809e-db0c5ca331ef"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1241, 25, 2.0145044319097503, 451.9919419822724, 117, 3665, 148.0, 1219.0, 1499.299999999999, 2177.1399999999903, 4.873948919758542, 698.5268000915092, 3.55793545945118], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 51, 0, 0.0, 2110.156862745098, 1546, 2933, 2084.0, 2522.6000000000004, 2763.8, 2933.0, 0.2369624205478943, 285.14562335345965, 1.1651423705650856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/be768e3e-4b98-43dc-8964-6a53b3438bb5", 3, 0, 0.0, 1060.0, 419, 1924, 837.0, 1924.0, 1924.0, 1924.0, 0.01719710171512428, 0.02370759302198936, 0.01102808931601394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0accfe2-b127-4b71-90d2-086acefa6626", 3, 0, 0.0, 1006.0, 238, 2324, 456.0, 2324.0, 2324.0, 2324.0, 0.046572280178837556, 0.02994148872174615, 0.02986568748447591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4eb0774a-4016-4809-99e9-6b00a6a12ba7", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e4c38aa-0a4b-4438-809e-db0c5ca331ef", 3, 0, 0.0, 587.3333333333333, 248, 1201, 313.0, 1201.0, 1201.0, 1201.0, 0.05226845076311938, 0.033603577557669524, 0.03351850520942226], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 649.6428571428571, 125, 1160, 591.5, 1119.0, 1160.0, 1160.0, 0.10043906218612793, 0.018965439546445893, 0.06792387750380233], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 649.6428571428571, 125, 1160, 591.5, 1119.0, 1160.0, 1160.0, 0.09723775325225556, 0.018360951315140612, 0.06575892981170603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 213.0, 120, 380, 127.0, 379.2, 380.0, 380.0, 0.11180900391331514, 0.049674335722976755, 0.06266134203689698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a98078b-0a80-434d-9479-e5fd72680d39", 3, 0, 0.0, 303.6666666666667, 216, 432, 263.0, 432.0, 432.0, 432.0, 0.020092559725133782, 0.020151424646203512, 0.012884877167484881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 155.8235294117647, 120, 382, 126.0, 366.0, 382.0, 382.0, 0.11180532719500165, 0.08308970116737914, 0.05612103337717855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 267.6470588235294, 118, 972, 127.0, 961.6, 972.0, 972.0, 0.11180900391331514, 3.8943034956756226, 0.06471023175704561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 310.4117647058824, 120, 1312, 126.0, 1151.1999999999998, 1312.0, 1312.0, 0.11180973928599616, 11.862661363651311, 0.06460146816053247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52942f32-2771-4e30-ae21-51a3effe1968", 3, 0, 0.0, 688.0, 208, 1095, 761.0, 1095.0, 1095.0, 1095.0, 0.02533826584908529, 0.025412499049815032, 0.016248822826399095], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 273.28571428571433, 123, 472, 236.0, 445.5, 472.0, 472.0, 0.10032677865046151, 0.1858452799833744, 0.06485269655090867], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 141.0625, 120, 363, 126.5, 202.00000000000017, 363.0, 363.0, 0.08632876150600524, 0.06415643311139647, 0.04333299161531904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 202.0, 121, 377, 127.0, 375.6, 377.0, 377.0, 0.0863292272994599, 0.023099812773488295, 0.049234637444223225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 850.0, 603, 1000, 862.5, 1000.0, 1000.0, 1000.0, 0.07318367272261558, 21.51842970708235, 0.0417375633496167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1197.8749999999998, 883, 1489, 1281.0, 1489.0, 1489.0, 1489.0, 0.07299669689946531, 65.68255618464515, 0.04155964286366042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 246.75, 125, 378, 241.5, 378.0, 378.0, 378.0, 0.07350103820216461, 0.1300623840061741, 0.04069832877014388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 167.75, 121, 376, 127.5, 375.7, 376.0, 376.0, 0.06108766589119268, 0.04539815795234144, 0.03066314479304008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 189.41666666666669, 121, 397, 126.0, 390.70000000000005, 397.0, 397.0, 0.06101064127268198, 0.016325112996791857, 0.03479513135082644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 146.16666666666666, 118, 381, 126.5, 305.7000000000003, 381.0, 381.0, 0.06108859883117148, 0.016465286403714186, 0.03591341454723167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 183.91666666666666, 119, 367, 126.0, 365.8, 367.0, 367.0, 0.061014674029103995, 0.016445361359406937, 0.035929539491747764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 186.375, 120, 376, 126.0, 376.0, 376.0, 376.0, 0.07350576560848991, 0.05462684338677815, 0.04127521018054854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 766.1000000000001, 118, 1621, 602.5, 1557.8, 1617.95, 1621.0, 0.09332014408630247, 41.997391191628246, 0.050852187890778104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 153.49999999999997, 118, 357, 124.5, 356.3, 357.0, 357.0, 0.08633248799438839, 0.023269303404737495, 0.05075406032482598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 538.2, 118, 1125, 537.5, 1078.4, 1123.05, 1125.0, 0.09331709615860175, 13.731738281705649, 0.05094165698501794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 156.4375, 120, 376, 125.0, 374.6, 376.0, 376.0, 0.0863310905235441, 0.023268926742673997, 0.05083754647040732], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 503.2857142857142, 128, 1220, 458.5, 1098.0, 1220.0, 1220.0, 0.09752291788570315, 0.01841479762253058, 0.06674088639624955], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de6dffc9-f857-4db7-bb7b-93db69777251", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48d264e8-241f-4c07-8ec8-9be67c65468e", 3, 0, 0.0, 298.3333333333333, 220, 444, 231.0, 444.0, 444.0, 444.0, 0.10659465605457646, 0.04823130596219443, 0.06835659909749858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 380.33333333333337, 247, 757, 256.5, 754.9, 757.0, 757.0, 0.06097065279245589, 0.09449260349768311, 0.13712442712990813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cc34792-87ab-46ea-89b7-2f07c3e7d281", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 0.6741196361940298, 2.572586287313433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 614.0434782608694, 144, 2100, 413.0, 1349.2000000000003, 1968.7999999999981, 2100.0, 0.10814775804995486, 0.06643060528654454, 0.04889883982141514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 137.05, 119, 368, 125.0, 130.70000000000002, 356.14999999999986, 368.0, 0.09331709615860175, 0.0693499122819296, 0.04684080803273564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 212.65, 119, 418, 126.5, 380.7, 416.15, 418.0, 0.09331796697477149, 0.0950494526901237, 0.049301777473975954], "isController": false}, {"data": ["login", 23, 0, 0.0, 3439.173913043478, 1582, 6102, 3204.0, 5133.6, 5940.799999999997, 6102.0, 0.1046629625079066, 43.69270733789755, 0.21828040316855743], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 128.5, 122, 136, 128.0, 136.0, 136.0, 136.0, 0.08524831234981645, 0.0690145028691385, 0.030303111030598816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/598213d9-528b-4a9e-ab90-b4ea0c5bc403", 3, 0, 0.0, 366.3333333333333, 239, 460, 400.0, 460.0, 460.0, 460.0, 0.03490929401771065, 0.02910244205057193, 0.02238649388505533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d68c31b-d242-492a-94f3-7c159e48e075", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 918.3499999999999, 248, 1750, 977.0, 1679.6000000000001, 1746.55, 1750.0, 0.09326183259501049, 55.85905623397063, 0.19781709023082306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be768e3e-4b98-43dc-8964-6a53b3438bb5", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=960f8473-5562-4137-a46e-a2f2222fd51b", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 514.2352941176471, 248, 1436, 493.0, 1276.8, 1436.0, 1436.0, 0.1117142218775875, 15.876183729234297, 0.24788518201203885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 2, 20.0, 1137.8, 123, 1859, 1216.5, 1847.8, 1859.0, 1859.0, 0.09114274777155981, 87.23560770566361, 0.17649116655881442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4eb0774a-4016-4809-99e9-6b00a6a12ba7", 3, 0, 0.0, 472.0, 222, 932, 262.0, 932.0, 932.0, 932.0, 0.04032854319859119, 0.03278006912984447, 0.02586172854857573], "isController": false}, {"data": ["register", 24, 9, 37.5, 1167.875, 165, 2371, 1156.0, 1943.0, 2270.0, 2371.0, 0.10056863180566789, 0.03128038010752463, 0.04537373817794781], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 148.25, 125, 381, 129.0, 248.00000000000014, 381.0, 381.0, 0.08043596291902108, 0.062447842305294696, 0.028592471193870782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 389.06249999999994, 245, 739, 368.0, 578.0000000000002, 739.0, 739.0, 0.08627057688056379, 0.13370254444282687, 0.19402454937103358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52942f32-2771-4e30-ae21-51a3effe1968", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 629.5882352941176, 248, 2020, 490.0, 1555.9999999999995, 2020.0, 2020.0, 0.10513036164844407, 22.32931921520185, 0.23169383758286746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 126.75, 124, 130, 126.5, 130.0, 130.0, 130.0, 0.024470968255036432, 0.01818594418172141, 0.012283278987391334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 189.0, 120, 378, 129.0, 378.0, 378.0, 378.0, 0.024472016249418787, 0.006548176222989012, 0.013956696767246654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 125.75, 124, 128, 125.5, 128.0, 128.0, 128.0, 0.02447141738449491, 0.006595811716914644, 0.014386516860806579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/037816c0-2130-4e8a-ac39-c9c175470296", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.8772965315934066, 1.6392299107142858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 123.0, 119, 127, 123.0, 127.0, 127.0, 127.0, 0.02447216597022961, 0.00659601348416345, 0.01441085554692232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 128.0, 7.8125, 2.3040771484375, 4.82940673828125], "isController": false}, {"data": ["https://demoqa.com/books", 51, 0, 0.0, 1446.313725490196, 977, 2353, 1348.0, 1996.8, 2237.8, 2353.0, 0.23655245666683672, 282.9989771135498, 0.4670986986136171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1167.875, 165, 2371, 1156.0, 1943.0, 2270.0, 2371.0, 0.10106667452740802, 0.031435288903300246, 0.04559844104654541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d0cef53-ad55-40c6-a9ba-6b9707e03fa4", 3, 0, 0.0, 362.6666666666667, 256, 434, 398.0, 434.0, 434.0, 434.0, 0.01898289641033429, 0.02616945517505394, 0.012173276669387547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 171.0, 123, 353, 127.0, 353.0, 353.0, 353.0, 0.02788669079794977, 0.007516334629134899, 0.016421557178870814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 175.8, 124, 375, 128.0, 375.0, 375.0, 375.0, 0.027887001868429125, 0.007516418472350038, 0.01639450695780697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 155.4375, 120, 372, 125.5, 365.7, 372.0, 372.0, 0.07746008385054076, 0.020877913225341067, 0.04553805710744682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 155.06249999999997, 120, 379, 124.5, 369.90000000000003, 379.0, 379.0, 0.07745858386344052, 0.02087750893194295, 0.045612818427397096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 125.0625, 119, 131, 125.5, 129.6, 131.0, 131.0, 0.07745670896125711, 0.057563042499528, 0.03887963711531851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 170.2, 123, 353, 125.0, 353.0, 353.0, 353.0, 0.027851584476640875, 0.007452474752538672, 0.01588410677183425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a98078b-0a80-434d-9479-e5fd72680d39", 1, 0, 0.0, 1220.0, 1220, 1220, 1220.0, 1220.0, 1220.0, 1220.0, 0.819672131147541, 0.14808529713114754, 0.565125512295082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 155.75000000000003, 122, 375, 125.5, 365.90000000000003, 375.0, 375.0, 0.07745970884831936, 0.020726523656679204, 0.044176240202557136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 202.8, 124, 510, 127.0, 510.0, 510.0, 510.0, 0.027886535265312495, 0.02072427083681915, 0.013997733521846311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 130.4, 120, 134, 133.0, 134.0, 134.0, 134.0, 0.02869177005267809, 0.02258356119380717, 0.010199027635912915], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 621.5714285714287, 123, 1201, 537.0, 1081.0, 1201.0, 1201.0, 0.09509189952861588, 0.01777003340102971, 0.06471900555947999], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1872.782608695652, 834, 3665, 1676.0, 3424.2000000000003, 3628.9999999999995, 3665.0, 0.10578165746059634, 0.05475027192784771, 0.04865543033587976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 425.2, 248, 885, 257.0, 885.0, 885.0, 885.0, 0.02783158550976332, 0.04313352168358827, 0.0625938881142431], "isController": false}, {"data": ["addBook", 56, 12, 21.428571428571427, 1288.0357142857142, 634, 3446, 1000.5, 2316.0, 2503.8999999999996, 3446.0, 0.2762744391875558, 89.65500133049576, 1.0023668717963266], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48d264e8-241f-4c07-8ec8-9be67c65468e", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.5458128776435045, 2.082939954682779], "isController": false}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 229.58823529411768, 121, 514, 129.0, 502.8, 507.4, 514.0, 0.23805634000046677, 0.17691491673862814, 0.11507606279319438], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 0, 0.0, 799.0000000000001, 592, 1135, 740.0, 1006.6, 1129.4, 1135.0, 0.2378187820880489, 69.9266182606354, 0.11960612575717303], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 178.33333333333331, 119, 380, 127.0, 374.20000000000005, 377.4, 380.0, 0.2382542967527341, 0.4215984235507365, 0.11586976541295076], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 1215.1960784313728, 848, 1863, 1162.0, 1498.6000000000001, 1724.1999999999998, 1863.0, 0.2371376095599005, 213.37683792545278, 0.11903196417362193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 130.7058823529412, 124, 139, 131.0, 137.4, 139.0, 139.0, 0.09987603621387572, 0.07461442158556145, 0.03550280974790113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 12, 7.361963190184049, 202.6134969325154, 120, 2709, 132.0, 362.59999999999997, 457.3999999999994, 1409.79999999997, 0.6729780724751968, 1.4742482347227785, 0.3236715198673036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 130.75, 128, 136, 129.5, 136.0, 136.0, 136.0, 0.02460539104117712, 0.01905476083559908, 0.00874644759666843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 152.76470588235293, 126, 456, 131.0, 222.3999999999998, 456.0, 456.0, 0.11146883134765817, 0.09045956918935932, 0.03962368614311287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=598213d9-528b-4a9e-ab90-b4ea0c5bc403", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de6dffc9-f857-4db7-bb7b-93db69777251", 3, 0, 0.0, 948.3333333333334, 227, 2031, 587.0, 2031.0, 2031.0, 2031.0, 0.029797969764993344, 0.024841341330777332, 0.019108724100597947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 317.75, 251, 509, 255.5, 509.0, 509.0, 509.0, 0.02445226917057903, 0.03789624138057512, 0.054993726464690924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 328.75, 247, 506, 255.5, 502.5, 506.0, 506.0, 0.07740949137126076, 0.11996959258417073, 0.17409576037891944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cc34792-87ab-46ea-89b7-2f07c3e7d281", 3, 0, 0.0, 428.3333333333333, 264, 549, 472.0, 549.0, 549.0, 549.0, 0.09365634365634366, 0.04146244380619381, 0.060059569336913095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d0cef53-ad55-40c6-a9ba-6b9707e03fa4", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d68c31b-d242-492a-94f3-7c159e48e075", 3, 0, 0.0, 330.6666666666667, 233, 525, 234.0, 525.0, 525.0, 525.0, 0.03844379517145933, 0.032049010232456814, 0.02465308479419755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/960f8473-5562-4137-a46e-a2f2222fd51b", 3, 0, 0.0, 484.33333333333337, 206, 961, 286.0, 961.0, 961.0, 961.0, 0.0765872711955273, 0.035551252840111305, 0.049113582114319265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 155.83333333333331, 125, 382, 135.0, 315.10000000000025, 382.0, 382.0, 0.060387385075257774, 0.0500672753211854, 0.02146582828847054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 170.5, 125, 388, 132.0, 379.8, 387.6, 388.0, 0.09221094175034811, 0.07158954950344408, 0.032778108200319046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aada61e1-a977-4bf6-ad81-18183d95cd47", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.4682345124633431, 0.8748969024926686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0accfe2-b127-4b71-90d2-086acefa6626", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e4c38aa-0a4b-4438-809e-db0c5ca331ef", 1, 0, 0.0, 976.0, 976, 976, 976.0, 976.0, 976.0, 976.0, 1.0245901639344264, 0.18510662141393444, 0.7064068903688525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 176.88235294117646, 120, 505, 126.0, 403.3999999999999, 505.0, 505.0, 0.10521234326455335, 0.07819003244562997, 0.05281166449021525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 211.88235294117644, 118, 380, 127.0, 377.6, 380.0, 380.0, 0.10521364559092934, 0.05603980479774224, 0.05844530979229589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 376.64705882352933, 119, 1515, 126.0, 1358.1999999999998, 1515.0, 1515.0, 0.10521494794954633, 16.730282786447695, 0.060259250405387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 341.0, 117, 957, 127.0, 889.8, 957.0, 957.0, 0.10521299442371129, 5.482667996527971, 0.06036087863681093], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 36.0, 0.7252215954875101], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.0, 0.08058017727639001], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.08058017727639001], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.1281224818694602], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1241, 25, "401/Unauthorized", 14, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

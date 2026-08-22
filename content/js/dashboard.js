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

    var data = {"OkPercent": 97.83582089552239, "KoPercent": 2.1641791044776117};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8091432225063938, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=970a7cbd-fc9c-4149-bc4d-73f6621a2c24"], "isController": false}, {"data": [0.4375, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/339a3703-afaf-4800-9067-a7fb1a19df80"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/376fb630-9c7d-4d3c-bffc-ea4420e3a351"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.65625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50c822b3-dc5d-4625-9bb0-fea7aeea2b61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35020c03-36ae-4622-b781-5b722e9300df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/de2bd7b1-53f7-46e5-9d76-e9edc22fd70f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d9dde4e-d6c6-4078-8938-323c1aa82933"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3fd45586-4dfc-4c1b-bc04-e94671c1f30e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c11899b-843c-4806-b28d-98156d71e90f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/503385b9-1566-4d13-a587-aa96e056a13b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8bb9b632-b9b7-4a42-aea1-b44a60f2eed8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d9cd5e9-9252-415c-8a89-aafe301815d8"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af0b96e7-b739-479b-bbd4-7f1c22bb6503"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=376fb630-9c7d-4d3c-bffc-ea4420e3a351"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/970a7cbd-fc9c-4149-bc4d-73f6621a2c24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1d9dde4e-d6c6-4078-8938-323c1aa82933"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3548387096774194, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/aff3ca10-1b24-4a2d-862d-30a97878a3dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50c822b3-dc5d-4625-9bb0-fea7aeea2b61"], "isController": false}, {"data": [0.9138888888888889, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aff3ca10-1b24-4a2d-862d-30a97878a3dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bb9b632-b9b7-4a42-aea1-b44a60f2eed8"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de2bd7b1-53f7-46e5-9d76-e9edc22fd70f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/37a92d2a-955c-4d4b-b98e-5413c0d7fce4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=503385b9-1566-4d13-a587-aa96e056a13b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1c11899b-843c-4806-b28d-98156d71e90f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35020c03-36ae-4622-b781-5b722e9300df"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fd45586-4dfc-4c1b-bc04-e94671c1f30e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af0b96e7-b739-479b-bbd4-7f1c22bb6503"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4d9cd5e9-9252-415c-8a89-aafe301815d8"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1340, 29, 2.1641791044776117, 294.0171641791049, 77, 2356, 93.0, 785.8000000000002, 1003.7500000000002, 1613.8499999999988, 5.234375, 723.0439414978027, 3.827747344970703], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=970a7cbd-fc9c-4149-bc4d-73f6621a2c24", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1293.1071428571436, 958, 1671, 1276.5, 1532.5, 1609.3, 1671.0, 0.2462610102857947, 296.3348396321366, 1.2108634636611095], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/339a3703-afaf-4800-9067-a7fb1a19df80", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/376fb630-9c7d-4d3c-bffc-ea4420e3a351", 3, 0, 0.0, 361.6666666666667, 248, 528, 309.0, 528.0, 528.0, 528.0, 0.03993822887267692, 0.025676432950370094, 0.02561142932264764], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 522.9374999999999, 91, 1332, 489.0, 1012.1000000000004, 1332.0, 1332.0, 0.08290842764166977, 0.01616269030075032, 0.055855909686813414], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 522.9374999999999, 91, 1332, 489.0, 1012.1000000000004, 1332.0, 1332.0, 0.0832258332986559, 0.016224567355707212, 0.05606974779971703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 98.23529411764706, 78, 239, 80.0, 236.6, 239.0, 239.0, 0.14807588453565143, 0.06578693077887915, 0.08298646194449767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 100.0, 78, 246, 82.0, 238.79999999999998, 246.0, 246.0, 0.14807072554655518, 0.11004084193450048, 0.0743245634091107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 157.64705882352942, 78, 617, 80.0, 565.0, 617.0, 617.0, 0.1480720152601277, 5.157342847686157, 0.08569769954881586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 203.58823529411765, 78, 932, 81.0, 745.5999999999998, 932.0, 932.0, 0.1477618426770969, 15.677066357018688, 0.08537388635375924], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 218.18750000000003, 78, 513, 203.5, 359.70000000000016, 513.0, 513.0, 0.08306467103794499, 0.1581037455028268, 0.053689872210195146], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 107.94117647058825, 79, 237, 80.0, 236.2, 237.0, 237.0, 0.08507954937866906, 0.06322806355192105, 0.04270594568421474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 98.3529411764706, 78, 239, 80.0, 238.2, 239.0, 239.0, 0.08508082678544616, 0.03779958147740353, 0.04768201666583254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 568.5, 464, 704, 579.0, 704.0, 704.0, 704.0, 0.04099536752346984, 12.053999226212438, 0.023380170540728898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 801.3333333333333, 689, 923, 815.5, 923.0, 923.0, 923.0, 0.04099900919061123, 36.890980538282825, 0.023342209334107758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 159.5, 79, 240, 159.0, 240.0, 240.0, 240.0, 0.04112631261481096, 0.0727742953691772, 0.02277208911386505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 81.73333333333333, 78, 96, 81.0, 92.4, 96.0, 96.0, 0.0710789307833372, 0.05282330695910119, 0.03567829142835481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 110.86666666666666, 78, 235, 79.0, 233.8, 235.0, 235.0, 0.0710846570876142, 0.019020699259771772, 0.04054046849527998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 122.73333333333332, 78, 253, 80.0, 243.4, 253.0, 253.0, 0.07108432022064573, 0.019159445684470918, 0.041789805442215555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 111.19999999999999, 78, 238, 80.0, 236.2, 238.0, 238.0, 0.07108432022064573, 0.019159445684470918, 0.04185922372368103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 81.0, 79, 85, 80.0, 85.0, 85.0, 85.0, 0.04117061790235702, 0.030596523655950867, 0.02311826688853055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 171.17647058823528, 78, 633, 80.0, 617.0, 633.0, 633.0, 0.0850804009789251, 9.026762712638442, 0.049157782229206595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 537.1111111111112, 78, 1022, 777.0, 1001.3000000000001, 1022.0, 1022.0, 0.08539345032236029, 42.69754981581107, 0.04612506463809782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 190.35294117647058, 79, 629, 82.0, 625.8, 629.0, 629.0, 0.08507954937866906, 2.963317576934434, 0.049240375688769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 393.6666666666667, 79, 791, 464.5, 717.2000000000002, 791.0, 791.0, 0.08539223499943072, 13.959202821976167, 0.046207799038862955], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 377.5333333333333, 81, 615, 413.0, 610.8, 615.0, 615.0, 0.08064429414737476, 0.01579809121676111, 0.054833919796561326], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/50c822b3-dc5d-4625-9bb0-fea7aeea2b61", 3, 0, 0.0, 459.66666666666663, 184, 940, 255.0, 940.0, 940.0, 940.0, 0.04571637560574198, 0.029926963327847368, 0.029316816387796776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 226.73333333333332, 159, 335, 175.0, 330.8, 335.0, 335.0, 0.07105165929308335, 0.11011619462707352, 0.15979684702340916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 588.0952380952383, 96, 1441, 557.0, 1184.2000000000003, 1420.4999999999998, 1441.0, 0.08723502361576711, 0.05358479477960694, 0.0394431796231447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 83.05555555555556, 78, 105, 81.0, 89.70000000000002, 105.0, 105.0, 0.08539142480336252, 0.06345983815953016, 0.04286249252825033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35020c03-36ae-4622-b781-5b722e9300df", 3, 0, 0.0, 391.0, 233, 511, 429.0, 511.0, 511.0, 511.0, 0.10097270371242974, 0.045687518932381946, 0.06475137575308809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 115.77777777777773, 77, 248, 80.0, 239.0, 248.0, 248.0, 0.08539264010323021, 0.09410239289153711, 0.04471624144294586], "isController": false}, {"data": ["login", 21, 0, 0.0, 2624.8571428571427, 1497, 5177, 2483.0, 3899.2000000000003, 5055.0999999999985, 5177.0, 0.0875415822515695, 30.04195547572597, 0.17355656045996848], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 96.70588235294119, 81, 240, 85.0, 138.39999999999992, 240.0, 240.0, 0.08356847207338294, 0.06765455405159616, 0.029705980307335348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de2bd7b1-53f7-46e5-9d76-e9edc22fd70f", 3, 0, 0.0, 412.6666666666667, 199, 526, 513.0, 526.0, 526.0, 526.0, 0.031348617525967105, 0.03164455174089323, 0.02010311735877448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d9dde4e-d6c6-4078-8938-323c1aa82933", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 630.2222222222222, 161, 1105, 860.0, 1105.0, 1105.0, 1105.0, 0.08535902956267724, 56.79161489799596, 0.17984117589176477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fd45586-4dfc-4c1b-bc04-e94671c1f30e", 3, 0, 0.0, 354.0, 251, 542, 269.0, 542.0, 542.0, 542.0, 0.018416432368721532, 0.02538853876352073, 0.011810016851035618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c11899b-843c-4806-b28d-98156d71e90f", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/503385b9-1566-4d13-a587-aa96e056a13b", 3, 0, 0.0, 254.33333333333331, 175, 387, 201.0, 387.0, 387.0, 387.0, 0.06263963418453637, 0.029036080429290293, 0.040169296661307495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bb9b632-b9b7-4a42-aea1-b44a60f2eed8", 3, 0, 0.0, 360.3333333333333, 177, 523, 381.0, 523.0, 523.0, 523.0, 0.017725153765708917, 0.024435555402922287, 0.011366716444806826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d9cd5e9-9252-415c-8a89-aafe301815d8", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 313.88235294117646, 158, 1179, 165.0, 860.5999999999997, 1179.0, 1179.0, 0.14765403790366008, 20.983744009697396, 0.32763284249222646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 618.1111111111111, 78, 1004, 793.0, 1004.0, 1004.0, 1004.0, 0.061458617863971596, 49.02273061919558, 0.10584539743239552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af0b96e7-b739-479b-bbd4-7f1c22bb6503", 3, 0, 0.0, 394.6666666666667, 294, 454, 436.0, 454.0, 454.0, 454.0, 0.12134449702705982, 0.054905224891801156, 0.07781531873154553], "isController": false}, {"data": ["register", 24, 9, 37.5, 1010.4166666666666, 101, 1731, 1053.0, 1632.5, 1709.5, 1731.0, 0.10040034638119501, 0.031228037424229114, 0.04529781252745322], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 96.5, 80, 268, 84.0, 118.60000000000024, 268.0, 268.0, 0.09583796993882343, 0.07440545517711389, 0.03406740337669114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 318.29411764705884, 160, 713, 313.0, 709.8, 713.0, 713.0, 0.08504464844043123, 12.08605709403687, 0.18870746985917605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 267.0, 158, 864, 180.0, 427.1999999999996, 864.0, 864.0, 0.09825056205100938, 7.057537443578171, 0.21948909165910524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=376fb630-9c7d-4d3c-bffc-ea4420e3a351", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 106.39999999999998, 79, 340, 80.5, 314.2000000000001, 340.0, 340.0, 0.04577413212245496, 0.03401768998553537, 0.02297646866302915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 94.7, 78, 233, 79.0, 217.80000000000007, 233.0, 233.0, 0.04577476071243837, 0.012248324643757923, 0.02610591821881251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 116.3, 79, 239, 80.0, 238.4, 239.0, 239.0, 0.0457425153809208, 0.012329037348763809, 0.02689159595636164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 116.9, 78, 239, 80.0, 238.4, 239.0, 239.0, 0.0457425153809208, 0.012329037348763809, 0.02693626638153832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 81.5, 81, 82, 81.5, 82.0, 82.0, 82.0, 0.06660893891960301, 0.019644433157929794, 0.041175252281356156], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 879.2142857142858, 625, 1343, 838.5, 1186.3, 1260.25, 1343.0, 0.24866785079928952, 297.4932004884547, 0.49102186944937837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1010.4166666666666, 101, 1731, 1053.0, 1632.5, 1709.5, 1731.0, 0.09668530544499411, 0.03007252908616272, 0.043621690542565705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/970a7cbd-fc9c-4149-bc4d-73f6621a2c24", 3, 0, 0.0, 300.0, 185, 457, 258.0, 457.0, 457.0, 457.0, 0.03531115008415824, 0.029437452918466552, 0.02264419455266658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 105.33333333333333, 79, 233, 80.0, 233.0, 233.0, 233.0, 0.03394817245671608, 0.009150093357474255, 0.01999096483535136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 107.33333333333333, 79, 235, 81.0, 235.0, 235.0, 235.0, 0.033947980378067344, 0.009150041586275963, 0.019957699401949743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 97.77777777777777, 78, 238, 80.0, 235.3, 238.0, 238.0, 0.09732465341609534, 0.026232035491056946, 0.05721625132469667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 110.55555555555556, 78, 316, 80.0, 245.80000000000013, 316.0, 316.0, 0.09732465341609534, 0.026232035491056946, 0.05731129493154832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 98.05555555555556, 78, 243, 80.0, 239.4, 243.0, 243.0, 0.09732412719182044, 0.07232779374314, 0.04885214978183174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 105.16666666666667, 78, 234, 79.5, 234.0, 234.0, 234.0, 0.03394817245671608, 0.009083788333144731, 0.019361067104220888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 123.44444444444444, 78, 238, 80.0, 237.1, 238.0, 238.0, 0.09732465341609534, 0.026041948277353632, 0.05550546640136687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 108.16666666666666, 80, 238, 83.0, 238.0, 238.0, 238.0, 0.033947980378067344, 0.02522891901143481, 0.017040294838209583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 87.83333333333333, 80, 98, 87.0, 98.0, 98.0, 98.0, 0.033988942264116744, 0.026753015102420015, 0.012082006820447749], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 496.57142857142856, 92, 940, 518.0, 762.0, 940.0, 940.0, 0.08362152895992736, 0.015626539905388214, 0.05691233663937021], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1387.8095238095239, 873, 1858, 1329.0, 1792.0, 1851.6999999999998, 1858.0, 0.08888550277449747, 0.04600519186570671, 0.040883859186316714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d9dde4e-d6c6-4078-8938-323c1aa82933", 3, 0, 0.0, 310.6666666666667, 198, 513, 221.0, 513.0, 513.0, 513.0, 0.018551498961116058, 0.025574738964950036, 0.011896631820767785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 240.66666666666666, 162, 475, 165.0, 475.0, 475.0, 475.0, 0.03393242922260804, 0.05258863786745993, 0.0763148286129554], "isController": false}, {"data": ["addBook", 62, 13, 20.967741935483872, 874.5645161290323, 408, 3260, 692.0, 1466.5000000000002, 1576.4499999999998, 3260.0, 0.2819527501762205, 82.67933985538552, 1.0258846907046544], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aff3ca10-1b24-4a2d-862d-30a97878a3dd", 3, 0, 0.0, 876.6666666666666, 206, 1878, 546.0, 1878.0, 1878.0, 1878.0, 0.04354326022903755, 0.027994120752717823, 0.02792324956093879], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 143.5178571428571, 78, 331, 81.5, 319.0, 325.3, 331.0, 0.24969234336264245, 0.18556237626852626, 0.12070088863721486], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 503.4642857142857, 385, 707, 469.5, 626.3, 701.0, 707.0, 0.24939654942059836, 73.3308662744609, 0.12542892866367986], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 129.07142857142856, 77, 324, 83.0, 239.3, 256.9, 324.0, 0.24999776787707254, 0.44237886268872595, 0.12158094570584191], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 734.4285714285714, 542, 1023, 705.5, 925.8000000000001, 954.2, 1023.0, 0.24905935618156427, 224.10404649182107, 0.12501612214582425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 83.94117647058823, 79, 100, 82.0, 97.6, 100.0, 100.0, 0.10231410430020163, 0.07643582987270922, 0.036369466762962294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50c822b3-dc5d-4625-9bb0-fea7aeea2b61", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 13, 7.222222222222222, 156.15555555555557, 79, 2014, 85.0, 289.9000000000001, 370.84999999999997, 1283.3799999999978, 0.7537877836126536, 1.5669887015586657, 0.36377867141762354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 87.8, 81, 99, 83.5, 98.9, 99.0, 99.0, 0.04460542045069316, 0.03454306486074188, 0.015855833050832338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aff3ca10-1b24-4a2d-862d-30a97878a3dd", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 86.70588235294116, 79, 107, 83.0, 105.4, 107.0, 107.0, 0.14337763983536872, 0.11635431513983537, 0.05096627041022873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bb9b632-b9b7-4a42-aea1-b44a60f2eed8", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 233.90000000000003, 161, 579, 163.0, 552.5000000000001, 579.0, 579.0, 0.04572515523690203, 0.07086505992281593, 0.10283694581111852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 245.05555555555551, 158, 479, 164.0, 478.1, 479.0, 479.0, 0.09728099615740066, 0.15076654384940902, 0.2187872403813415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de2bd7b1-53f7-46e5-9d76-e9edc22fd70f", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 109.46666666666667, 81, 241, 89.0, 239.2, 241.0, 241.0, 0.0690093024539708, 0.057215720491622275, 0.024530650481684933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37a92d2a-955c-4d4b-b98e-5413c0d7fce4", 2, 0, 0.0, 405.5, 268, 543, 405.5, 543.0, 543.0, 543.0, 0.0263664407941572, 0.037052058889445516, 0.016388905825665094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=503385b9-1566-4d13-a587-aa96e056a13b", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c11899b-843c-4806-b28d-98156d71e90f", 3, 0, 0.0, 354.0, 169, 584, 309.0, 584.0, 584.0, 584.0, 0.045264571419949606, 0.029100757992968903, 0.02902708518792341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 96.61111111111111, 81, 240, 83.5, 136.50000000000017, 240.0, 240.0, 0.08391647513508221, 0.06514999778553747, 0.029829684520673756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35020c03-36ae-4622-b781-5b722e9300df", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fd45586-4dfc-4c1b-bc04-e94671c1f30e", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af0b96e7-b739-479b-bbd4-7f1c22bb6503", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 80.29411764705883, 78, 90, 79.0, 83.6, 90.0, 90.0, 0.09838475383555856, 0.07311601334849616, 0.04938453464011436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 116.58823529411764, 77, 239, 80.0, 237.4, 239.0, 239.0, 0.09838475383555856, 0.03501791904670961, 0.05562400891828857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d9cd5e9-9252-415c-8a89-aafe301815d8", 3, 0, 0.0, 997.6666666666667, 206, 2356, 431.0, 2356.0, 2356.0, 2356.0, 0.016912842485060323, 0.02331571872533544, 0.010845800682151314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 176.76470588235293, 78, 784, 83.0, 345.5999999999996, 784.0, 784.0, 0.09838532322472365, 5.232445499233173, 0.05734245688407894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 139.35294117647058, 77, 620, 80.0, 312.7999999999997, 620.0, 620.0, 0.09829600976021555, 1.7250701262525514, 0.05738639402533724], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 31.03448275862069, 0.6716417910447762], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.896551724137931, 0.14925373134328357], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.4482758620689653, 0.07462686567164178], "isController": false}, {"data": ["401/Unauthorized", 17, 58.62068965517241, 1.2686567164179106], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1340, 29, "401/Unauthorized", 17, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

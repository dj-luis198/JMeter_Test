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

    var data = {"OkPercent": 98.47560975609755, "KoPercent": 1.524390243902439};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7427536231884058, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f0ae649-46f3-4a1a-a49d-d064c4506ccd"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d95cfbb-d1bb-4e31-8f2b-6f405d4cd1b9"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87598cd3-4aaa-4362-abdb-bdba5556794e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87037e81-3bfe-464f-9b83-6467bde52de4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/862db00f-079a-4691-b4d9-e0ed8c49ce29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbe8d153-125b-46b1-922a-9f4f1af3771d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78cf7b33-d7eb-40b8-983c-8036c10fdd48"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95620cb8-4c41-4810-816e-73ada2952fdb"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6769fad1-1c56-463a-83d0-469a943aa210"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/643a4a3d-4e9a-4e9e-a8aa-6024bd09b6b9"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc2b5a12-06b1-4540-a709-0d451a56245d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b008e89-4ed9-4f5b-95f6-6a85d47d53ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a09e89df-d177-4cc2-bb22-35ab4ffed3ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f0ae649-46f3-4a1a-a49d-d064c4506ccd"], "isController": false}, {"data": [0.3448275862068966, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d95cfbb-d1bb-4e31-8f2b-6f405d4cd1b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bc2b5a12-06b1-4540-a709-0d451a56245d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/78cf7b33-d7eb-40b8-983c-8036c10fdd48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00f58dbe-136e-44d8-b88d-f6727120b9c4"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=643a4a3d-4e9a-4e9e-a8aa-6024bd09b6b9"], "isController": false}, {"data": [0.9051724137931034, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95620cb8-4c41-4810-816e-73ada2952fdb"], "isController": false}, {"data": [0.41379310344827586, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9396551724137931, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4b008e89-4ed9-4f5b-95f6-6a85d47d53ea"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87037e81-3bfe-464f-9b83-6467bde52de4"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a09e89df-d177-4cc2-bb22-35ab4ffed3ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6769fad1-1c56-463a-83d0-469a943aa210"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/358ea248-a777-44dc-bce1-4ef43ad1a6db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a46e0d9-9610-4b55-ac05-fe3f19b641de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 20, 1.524390243902439, 443.3467987804875, 125, 2781, 147.5, 1230.7, 1454.3999999999996, 2019.8099999999931, 5.129909483685559, 742.4006671118356, 3.75342429766769], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2127.1896551724135, 1528, 3372, 2087.0, 2678.2, 2811.0499999999993, 3372.0, 0.26397833557108075, 317.65394232300935, 1.2979794136722573], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4f0ae649-46f3-4a1a-a49d-d064c4506ccd", 2, 0, 0.0, 237.5, 224, 251, 237.5, 251.0, 251.0, 251.0, 0.01174039635578097, 0.02321709240278952, 0.0072976194145064335], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 707.8333333333334, 135, 1338, 681.0, 1305.9, 1338.0, 1338.0, 0.07666360012266177, 0.015310259985433916, 0.05149587853291424], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 707.8333333333334, 135, 1338, 681.0, 1305.9, 1338.0, 1338.0, 0.07724095315336191, 0.015425561445178234, 0.051883693630196064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 222.88235294117646, 127, 406, 135.0, 396.4, 406.0, 406.0, 0.08949959198715418, 0.03976274382057964, 0.05015843402037432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 161.29411764705884, 127, 392, 133.0, 384.0, 392.0, 392.0, 0.08962179602079225, 0.06660369801935831, 0.044985940580749235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 296.70588235294116, 126, 1021, 133.0, 1014.6, 1021.0, 1021.0, 0.08962557597612797, 3.1216555161905966, 0.05187141991954786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 318.764705882353, 126, 1414, 132.0, 1185.9999999999998, 1414.0, 1414.0, 0.08949912080275448, 9.495574975914208, 0.051710831631095154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d95cfbb-d1bb-4e31-8f2b-6f405d4cd1b9", 1, 0, 0.0, 724.0, 724, 724, 724.0, 724.0, 724.0, 724.0, 1.3812154696132597, 0.2495359979281768, 0.9522833218232044], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 376.15384615384613, 127, 1750, 256.0, 1236.7999999999995, 1750.0, 1750.0, 0.07883470182290087, 0.14856716981904405, 0.050953558780366524], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87598cd3-4aaa-4362-abdb-bdba5556794e", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.6464290232793523, 1.2078536184210527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87037e81-3bfe-464f-9b83-6467bde52de4", 3, 0, 0.0, 495.66666666666663, 237, 759, 491.0, 759.0, 759.0, 759.0, 0.019396259108160004, 0.02292572162165657, 0.012438356264021878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 165.58823529411768, 127, 396, 132.0, 389.6, 396.0, 396.0, 0.09569970558267048, 0.07112058198087132, 0.048036766278801386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1063.0, 1008, 1168, 1046.0, 1168.0, 1168.0, 1168.0, 0.02662789644943629, 7.829485685508566, 0.015186222193819134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 191.11764705882354, 125, 398, 132.0, 392.4, 398.0, 398.0, 0.0955625259986284, 0.034013408265596366, 0.0540283996368624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1309.4, 1116, 1446, 1380.0, 1446.0, 1446.0, 1446.0, 0.026612589884022333, 23.94605515758645, 0.01515150381092287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 233.8, 127, 392, 132.0, 392.0, 392.0, 392.0, 0.026715538291381034, 0.04727397986717034, 0.01479268575313774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 137.58333333333331, 127, 187, 132.5, 173.50000000000006, 187.0, 187.0, 0.05661819520066432, 0.0420766079567437, 0.02841968001283346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/862db00f-079a-4691-b4d9-e0ed8c49ce29", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbe8d153-125b-46b1-922a-9f4f1af3771d", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 151.08333333333334, 127, 395, 128.5, 316.7000000000003, 395.0, 395.0, 0.05662246968338602, 0.015150934270749775, 0.032292502241306094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 129.83333333333334, 126, 134, 129.0, 134.0, 134.0, 134.0, 0.056621133838205114, 0.01526116497982872, 0.033287033760351054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 172.91666666666666, 127, 384, 131.5, 383.7, 384.0, 384.0, 0.05662193533774985, 0.015261381009002888, 0.03334279981314762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 183.0, 125, 392, 132.0, 392.0, 392.0, 392.0, 0.026752703360674594, 0.019881647712376337, 0.015022269953503802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 741.8, 127, 1817, 386.0, 1618.7000000000003, 1807.4499999999998, 1817.0, 0.10573283427435555, 42.8280396289967, 0.05807045507411872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 265.4117647058824, 127, 1375, 133.0, 596.5999999999993, 1375.0, 1375.0, 0.09570347685101784, 5.089816349601986, 0.05577938167109529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 605.7500000000001, 127, 1181, 403.0, 1172.1, 1180.6, 1181.0, 0.10573730623638633, 14.006300208699008, 0.05817617024763677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 221.9411764705882, 126, 628, 133.0, 447.99999999999983, 628.0, 628.0, 0.09555822868770447, 1.6770227604242787, 0.05578804447111332], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 532.6666666666666, 129, 1290, 513.5, 1143.3000000000006, 1290.0, 1290.0, 0.07740537193281213, 0.015458397031503987, 0.05244768283793896], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78cf7b33-d7eb-40b8-983c-8036c10fdd48", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.2996087271973466, 1.1433716832504146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 312.8333333333333, 260, 571, 264.0, 558.7, 571.0, 571.0, 0.05658295532775677, 0.08769252939956054, 0.12725639269514047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95620cb8-4c41-4810-816e-73ada2952fdb", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 561.5714285714284, 153, 1625, 473.0, 992.4000000000001, 1563.099999999999, 1625.0, 0.09610236274523264, 0.05903162711596809, 0.04345253315531515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 130.8, 127, 142, 129.5, 136.0, 141.7, 142.0, 0.10573507020808662, 0.07857850432456438, 0.05307404891304348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6769fad1-1c56-463a-83d0-469a943aa210", 3, 0, 0.0, 413.0, 260, 520, 459.0, 520.0, 520.0, 520.0, 0.04163370664890295, 0.026766461794135197, 0.026698698599719666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 183.8, 126, 424, 130.5, 398.0, 422.7, 424.0, 0.10573730623638633, 0.09975860503415315, 0.056307180752638145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/643a4a3d-4e9a-4e9e-a8aa-6024bd09b6b9", 3, 0, 0.0, 456.0, 317, 584, 467.0, 584.0, 584.0, 584.0, 0.07438078000644634, 0.033655365953437634, 0.04769861217861305], "isController": false}, {"data": ["login", 21, 0, 0.0, 2721.2380952380954, 1751, 4000, 2535.0, 3815.6, 3981.9999999999995, 4000.0, 0.09638200318519571, 27.586439561312723, 0.18347271672181859], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc2b5a12-06b1-4540-a709-0d451a56245d", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 138.47058823529406, 129, 157, 137.0, 146.6, 157.0, 157.0, 0.09619846308808383, 0.07787941982423975, 0.034195547425842306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b008e89-4ed9-4f5b-95f6-6a85d47d53ea", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a09e89df-d177-4cc2-bb22-35ab4ffed3ab", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.5628163940809968, 2.1478290498442365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 902.1999999999998, 260, 1947, 532.0, 1749.1000000000001, 1937.4499999999998, 1947.0, 0.10565910147500106, 56.972321318902935, 0.22546455335256327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 558.0588235294117, 258, 1541, 516.0, 1517.8, 1541.0, 1541.0, 0.08943555642068382, 12.71006772277345, 0.19845055364555111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 886.7777777777778, 127, 1839, 1242.0, 1839.0, 1839.0, 1839.0, 0.047868775729466954, 31.82108031183848, 0.0740625947402853], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1281.9523809523812, 147, 2427, 1308.0, 2154.4, 2402.8999999999996, 2427.0, 0.09406621365572662, 0.029710645607779723, 0.04244002998920478], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 494.70588235294116, 260, 1503, 509.0, 934.1999999999995, 1503.0, 1503.0, 0.09548684247479429, 6.85901385261325, 0.213315017061252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 137.37500000000003, 131, 150, 136.5, 149.3, 150.0, 150.0, 0.10091390152064636, 0.07834624190323619, 0.03587173843116726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 536.1499999999999, 263, 1585, 271.0, 1548.3000000000002, 1583.65, 1585.0, 0.10173405700159213, 18.39041282885534, 0.22489783675244543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 181.4, 127, 381, 131.5, 380.9, 381.0, 381.0, 0.05648855824252797, 0.04198026642828495, 0.028354608336581426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 220.10000000000002, 126, 523, 132.5, 509.50000000000006, 523.0, 523.0, 0.05656940500299818, 0.023633194785432247, 0.03178714417844253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 335.2, 128, 1122, 259.0, 1050.0000000000002, 1122.0, 1122.0, 0.056481539008974915, 5.095919994253003, 0.032719579043089767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 297.2, 127, 1036, 137.5, 971.1000000000003, 1036.0, 1036.0, 0.05656748500961647, 1.6769939154598936, 0.03282460897725987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 133.5, 129, 138, 133.5, 138.0, 138.0, 138.0, 0.02850220892119139, 0.008405924896679493, 0.017619041256947413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f0ae649-46f3-4a1a-a49d-d064c4506ccd", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1428.9310344827593, 1005, 2781, 1301.0, 2123.9, 2242.8499999999995, 2781.0, 0.25304747694213936, 302.7327559597044, 0.4996699202900448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1281.9523809523812, 147, 2427, 1308.0, 2154.4, 2402.8999999999996, 2427.0, 0.09704654999514767, 0.030651979518556687, 0.04378467392359202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 128.75, 125, 132, 129.0, 132.0, 132.0, 132.0, 0.025770207063613756, 0.006945876122614646, 0.015175229354842867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 131.25, 130, 132, 131.5, 132.0, 132.0, 132.0, 0.02576921094676081, 0.006945607637994125, 0.015149477529248055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 145.875, 127, 391, 129.0, 213.2000000000002, 391.0, 391.0, 0.10028832894571894, 0.02703083866115081, 0.0589585683841043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 195.5625, 127, 400, 133.0, 390.90000000000003, 400.0, 400.0, 0.1002864431532565, 0.02703033038115116, 0.05905539572403678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d95cfbb-d1bb-4e31-8f2b-6f405d4cd1b9", 3, 0, 0.0, 329.0, 236, 510, 241.0, 510.0, 510.0, 510.0, 0.024464033792985347, 0.02453570576698823, 0.01568819875396521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 128.5, 127, 130, 128.5, 130.0, 130.0, 130.0, 0.025769875016106173, 0.0068954548382940345, 0.014696881845123052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 132.99999999999997, 128, 139, 133.0, 137.6, 139.0, 139.0, 0.1002851859976809, 0.07452834623460466, 0.050338462502742175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 130.75, 127, 134, 131.0, 134.0, 134.0, 134.0, 0.025768712917211566, 0.019150381376951173, 0.012934685976022212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 162.75, 127, 394, 131.5, 387.0, 394.0, 394.0, 0.10028895755896677, 0.026835131221832908, 0.057196046107848245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 168.25, 142, 206, 162.5, 206.0, 206.0, 206.0, 0.02474910593854797, 0.01948025330709928, 0.008797533751593223], "isController": false}, {"data": ["deleteAccount", 11, 2, 18.181818181818183, 479.81818181818176, 127, 759, 510.0, 747.2, 759.0, 759.0, 0.09116450220037957, 0.017910781549133524, 0.062036213544558724], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1452.190476190476, 1063, 2580, 1378.0, 1853.0, 2507.599999999999, 2580.0, 0.09490796187411589, 0.049122284954376386, 0.0436539551198326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 263.0, 259, 267, 263.0, 267.0, 267.0, 267.0, 0.025746818658719483, 0.039902540245495915, 0.05790519860452242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc2b5a12-06b1-4540-a709-0d451a56245d", 3, 0, 0.0, 841.0, 347, 1750, 426.0, 1750.0, 1750.0, 1750.0, 0.019436345966958212, 0.026794571995464853, 0.012464063006154843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78cf7b33-d7eb-40b8-983c-8036c10fdd48", 3, 0, 0.0, 1038.6666666666667, 280, 2136, 700.0, 2136.0, 2136.0, 2136.0, 0.04072048104461608, 0.026179345723670814, 0.026113068899053928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00f58dbe-136e-44d8-b88d-f6727120b9c4", 2, 0, 0.0, 301.0, 256, 346, 301.0, 346.0, 346.0, 346.0, 0.015654596972400944, 0.022289455454844315, 0.00973061618450508], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 1362.8965517241384, 664, 2702, 1087.5, 2309.6000000000004, 2568.5, 2702.0, 0.2796703747100831, 93.37229054256052, 1.0157216264158313], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=643a4a3d-4e9a-4e9e-a8aa-6024bd09b6b9", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.5345090606508875, 2.0398021449704142], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 217.05172413793107, 126, 784, 133.0, 536.1, 542.9499999999999, 784.0, 0.25415187765654446, 0.1888765418912405, 0.12285662054686472], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 829.7586206896552, 626, 1174, 772.5, 1106.4, 1161.6499999999999, 1174.0, 0.25421760150076045, 74.7484156600234, 0.127853578879777], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 196.67241379310346, 128, 453, 134.0, 391.2, 396.4, 453.0, 0.2549148013202829, 0.4510797070237818, 0.1239722373608407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95620cb8-4c41-4810-816e-73ada2952fdb", 3, 0, 0.0, 380.6666666666667, 231, 603, 308.0, 603.0, 603.0, 603.0, 0.04047435949326102, 0.03374180815828173, 0.0259552370448321], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1208.206896551724, 875, 1965, 1165.0, 1564.2, 1698.2499999999993, 1965.0, 0.25395157406191166, 228.5060727401594, 0.1274717861990455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 167.35, 134, 393, 141.5, 360.8000000000004, 392.34999999999997, 393.0, 0.10569427929713304, 0.07896105826397147, 0.03757101334390276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, 4.022988505747127, 221.55747126436776, 128, 1599, 139.0, 419.0, 488.0, 1231.5, 0.718993409227082, 1.5765670518171113, 0.3441181806677548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 229.80000000000004, 128, 564, 142.0, 546.1, 564.0, 564.0, 0.054167072919713566, 0.041947742993489114, 0.01925470170192943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 137.58823529411768, 130, 150, 136.0, 149.2, 150.0, 150.0, 0.08687964103376551, 0.07050486494048744, 0.030882997398721336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b008e89-4ed9-4f5b-95f6-6a85d47d53ea", 3, 0, 0.0, 435.0, 265, 522, 518.0, 522.0, 522.0, 522.0, 0.03860208965978692, 0.03218097383421689, 0.02475459525708992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87037e81-3bfe-464f-9b83-6467bde52de4", 1, 0, 0.0, 1290.0, 1290, 1290, 1290.0, 1290.0, 1290.0, 1290.0, 0.7751937984496124, 0.14004966085271317, 0.5344597868217054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 557.5, 262, 1250, 513.0, 1215.4, 1250.0, 1250.0, 0.05636025474835146, 6.82125851568224, 0.1253135039170377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 346.3125, 260, 530, 269.5, 528.6, 530.0, 530.0, 0.10020102831305305, 0.15529202337188985, 0.22535446113765742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a09e89df-d177-4cc2-bb22-35ab4ffed3ab", 3, 0, 0.0, 380.6666666666667, 281, 462, 399.0, 462.0, 462.0, 462.0, 0.06954586549829614, 0.0322826836590398, 0.04459809734102974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6769fad1-1c56-463a-83d0-469a943aa210", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 179.33333333333334, 130, 390, 138.5, 387.90000000000003, 390.0, 390.0, 0.05919202880678735, 0.049076203571252405, 0.021040916489912694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/358ea248-a777-44dc-bce1-4ef43ad1a6db", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 152.45, 128, 401, 136.0, 157.70000000000002, 388.8499999999998, 401.0, 0.10673554667278617, 0.08286597617662599, 0.03794115135634196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a46e0d9-9610-4b55-ac05-fe3f19b641de", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.9072043678977273, 1.6951127485795456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 158.95, 126, 395, 131.5, 370.5000000000005, 394.95, 395.0, 0.10249367101581476, 0.07616961293265141, 0.05144701845911016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 183.75000000000003, 127, 399, 132.0, 397.7, 398.95, 399.0, 0.10249734788112357, 0.050517979956643616, 0.05716429235831023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 332.79999999999995, 125, 1457, 130.5, 1395.3000000000009, 1455.75, 1457.0, 0.10180448448754169, 13.76390168072841, 0.05853757858033646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 308.85, 127, 1040, 133.5, 991.2000000000003, 1038.15, 1040.0, 0.10210176482900507, 4.526588017464507, 0.058808223531393734], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 25.0, 0.38109756097560976], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.1524390243902439], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.0, 0.1524390243902439], "isController": false}, {"data": ["401/Unauthorized", 11, 55.0, 0.8384146341463414], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 20, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 97.30538922155688, "KoPercent": 2.694610778443114};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.765685019206146, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15789473684210525, 500, 1500, "see books"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/100f3614-1482-408b-8251-5919d6598947"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26c5c959-dcfd-43b6-8cd5-5f5ffd919f87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0718287a-4bae-4387-b7c2-de5dbb38cbc7"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7dfb82f4-fb23-4c0c-bc1f-d081e23b5520"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2110429-3a38-4676-bbbf-9d8662b682a4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb48be96-b0c7-4f53-8a38-66cab79f2f2f"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e9cf7c5-185d-4bb5-bee4-f9e5474ef5e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ccb63de-cf77-443a-aa3d-5cd3cdc03939"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f173080-8740-4e5b-b621-7dd8d9d1cde6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72cf2b47-eb8b-4a21-8e45-2977652280dd"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23f12c86-eb58-408d-9203-80463b65adad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61811f4d-5bf6-477f-a977-70b56505fba0"], "isController": false}, {"data": [0.2647058823529412, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c2c7647-50ec-4a97-8833-f17a61eec00f"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72cf2b47-eb8b-4a21-8e45-2977652280dd"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7dfb82f4-fb23-4c0c-bc1f-d081e23b5520"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e9cf7c5-185d-4bb5-bee4-f9e5474ef5e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98cb6b4c-90d6-44ec-8104-05affd3f6d6d"], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0718287a-4bae-4387-b7c2-de5dbb38cbc7"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/26c5c959-dcfd-43b6-8cd5-5f5ffd919f87"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9093567251461988, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/148b0bce-6087-42fc-85b2-7ecb39eadc03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98cb6b4c-90d6-44ec-8104-05affd3f6d6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=100f3614-1482-408b-8251-5919d6598947"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4f173080-8740-4e5b-b621-7dd8d9d1cde6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2110429-3a38-4676-bbbf-9d8662b682a4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ccb63de-cf77-443a-aa3d-5cd3cdc03939"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb48be96-b0c7-4f53-8a38-66cab79f2f2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c2c7647-50ec-4a97-8833-f17a61eec00f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1336, 36, 2.694610778443114, 363.344311377246, 93, 2211, 114.0, 1012.3, 1222.049999999999, 1655.8199999999983, 5.220503762982877, 760.6868138258849, 3.817345316688419], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1672.7192982456138, 1223, 2263, 1637.0, 2120.0, 2186.2999999999997, 2263.0, 0.2519893899204244, 303.2285061270447, 1.2390298615716182], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 509.0, 102, 1013, 506.0, 918.2, 1013.0, 1013.0, 0.08011108737449263, 0.016303858016449475, 0.05368381655896176], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 509.0, 102, 1013, 506.0, 918.2, 1013.0, 1013.0, 0.0817037965030775, 0.016627999210196632, 0.05475111832071464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 124.29411764705883, 97, 298, 102.0, 291.6, 298.0, 298.0, 0.08989762247229038, 0.031997108733818426, 0.05082562042579744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 114.11764705882352, 96, 292, 103.0, 149.59999999999988, 292.0, 292.0, 0.0898923935171721, 0.06680479635407027, 0.04512176783967427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 177.2941176470588, 97, 788, 102.0, 402.39999999999964, 788.0, 788.0, 0.08989857325676091, 1.5776972381307441, 0.05248386948578016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 165.1176470588235, 93, 806, 102.0, 403.5999999999996, 806.0, 806.0, 0.08989999947117648, 4.781168899954522, 0.05239690915869465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/100f3614-1482-408b-8251-5919d6598947", 3, 0, 0.0, 676.0, 200, 1446, 382.0, 1446.0, 1446.0, 1446.0, 0.03547734771348494, 0.029576005043696264, 0.022750773110535586], "isController": false}, {"data": ["goToProfile", 18, 5, 27.77777777777778, 315.88888888888886, 99, 1360, 238.0, 649.9000000000011, 1360.0, 1360.0, 0.08901460828627097, 0.13062430148258775, 0.05752240664592956], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26c5c959-dcfd-43b6-8cd5-5f5ffd919f87", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 122.55000000000001, 96, 313, 102.0, 286.90000000000043, 312.7, 313.0, 0.11464931640345094, 0.0852032517412365, 0.05754858264782597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 620.1111111111111, 487, 771, 591.0, 771.0, 771.0, 771.0, 0.042926028913065246, 12.621677778744937, 0.024481250864482527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 162.3, 96, 317, 103.0, 314.1, 316.9, 317.0, 0.11450884294539647, 0.047838752941445906, 0.0643441291316222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1107.0, 879, 1313, 1121.0, 1313.0, 1313.0, 1313.0, 0.04279661621421133, 38.508470497974294, 0.02436565161414571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 248.77777777777777, 100, 399, 300.0, 399.0, 399.0, 399.0, 0.04298918105610088, 0.07607069929067851, 0.023803579744930862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 132.38461538461542, 99, 296, 104.0, 293.6, 296.0, 296.0, 0.058258083309059135, 0.043295313865423825, 0.02924282697349257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 116.53846153846155, 97, 297, 102.0, 220.99999999999994, 297.0, 297.0, 0.05825860546824234, 0.015588728416307032, 0.03322561093110696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 132.92307692307693, 95, 309, 102.0, 305.4, 309.0, 309.0, 0.05825912763678571, 0.0157026554958524, 0.03424999495834472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 140.15384615384616, 97, 412, 102.0, 365.99999999999994, 412.0, 412.0, 0.05825886655134399, 0.015702585125166934, 0.03430673489302776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 102.55555555555554, 98, 112, 101.0, 112.0, 112.0, 112.0, 0.04300253237135076, 0.03195793665488079, 0.024146929798365906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 638.8235294117648, 97, 1286, 866.0, 1270.0, 1286.0, 1286.0, 0.08858642126490987, 42.21076309548314, 0.048048770081760055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 206.0, 97, 1244, 101.0, 820.1000000000013, 1225.7499999999998, 1244.0, 0.11464865918393084, 10.343917763233321, 0.06641560998819118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0718287a-4bae-4387-b7c2-de5dbb38cbc7", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 470.0588235294118, 99, 888, 597.0, 880.0, 888.0, 888.0, 0.0886811547329654, 13.815767916853591, 0.04818675566516083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 206.2, 97, 809, 102.0, 765.3000000000009, 808.95, 809.0, 0.11464865918393084, 3.3988625061623656, 0.0665275715694255], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 460.2000000000001, 106, 962, 458.0, 960.2, 962.0, 962.0, 0.08170335147147735, 0.016627908639312385, 0.05516571992908149], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7dfb82f4-fb23-4c0c-bc1f-d081e23b5520", 1, 0, 0.0, 959.0, 959, 959, 959.0, 959.0, 959.0, 959.0, 1.0427528675703859, 0.18838796923879042, 0.7189292231491137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 291.2307692307692, 200, 599, 207.0, 597.8, 599.0, 599.0, 0.05823068309070549, 0.09024618561030236, 0.13096217105263158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2110429-3a38-4676-bbbf-9d8662b682a4", 3, 0, 0.0, 492.66666666666663, 194, 891, 393.0, 891.0, 891.0, 891.0, 0.03646396752275959, 0.03039850938339431, 0.023383468756457162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb48be96-b0c7-4f53-8a38-66cab79f2f2f", 3, 0, 0.0, 592.3333333333334, 234, 1044, 499.0, 1044.0, 1044.0, 1044.0, 0.04283511337026672, 0.026646452360214744, 0.02746913194642755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 506.95833333333326, 114, 1216, 439.5, 967.5, 1154.25, 1216.0, 0.10672263676061222, 0.06555521340080575, 0.04825447345719088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 127.05882352941175, 98, 300, 103.0, 299.2, 300.0, 300.0, 0.08867930433693963, 0.06590327207071392, 0.0445128539347529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 209.23529411764704, 99, 318, 296.0, 314.0, 318.0, 318.0, 0.08858549803288085, 0.09414244678356479, 0.0465827004246893], "isController": false}, {"data": ["login", 24, 0, 0.0, 2609.625, 1618, 4023, 2322.0, 3686.0, 3998.75, 4023.0, 0.10456741766405103, 47.051342636111926, 0.2227929330942806], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 118.85000000000001, 96, 343, 106.5, 122.50000000000001, 331.99999999999983, 343.0, 0.1078010208756677, 0.08727250615813333, 0.0383198941393975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e9cf7c5-185d-4bb5-bee4-f9e5474ef5e6", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ccb63de-cf77-443a-aa3d-5cd3cdc03939", 1, 0, 0.0, 875.0, 875, 875, 875.0, 875.0, 875.0, 875.0, 1.142857142857143, 0.20647321428571427, 0.7879464285714286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f173080-8740-4e5b-b621-7dd8d9d1cde6", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72cf2b47-eb8b-4a21-8e45-2977652280dd", 1, 0, 0.0, 962.0, 962, 962, 962.0, 962.0, 962.0, 962.0, 1.0395010395010396, 0.18780048076923078, 0.7166872401247402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 779.8823529411765, 202, 1391, 965.0, 1373.4, 1391.0, 1391.0, 0.08853705536169991, 56.1404476003854, 0.18712912901671788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23f12c86-eb58-408d-9203-80463b65adad", 2, 0, 0.0, 315.5, 242, 389, 315.5, 389.0, 389.0, 389.0, 0.0299805126667666, 0.025266779718183183, 0.01863534796132514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61811f4d-5bf6-477f-a977-70b56505fba0", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 689.1764705882352, 99, 1422, 979.0, 1294.8, 1422.0, 1422.0, 0.07471673566976961, 47.332039113112344, 0.11234121320200768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 329.764705882353, 199, 905, 212.0, 657.7999999999997, 905.0, 905.0, 0.08984298616946501, 6.4536041901183285, 0.20070679510250028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c2c7647-50ec-4a97-8833-f17a61eec00f", 3, 0, 0.0, 302.0, 216, 442, 248.0, 442.0, 442.0, 442.0, 0.07513524343818874, 0.03399674100881587, 0.048182431501703066], "isController": false}, {"data": ["register", 25, 9, 36.0, 1001.8000000000001, 185, 1727, 1009.0, 1676.4, 1725.5, 1727.0, 0.09818707386809941, 0.030591410202029722, 0.04429924621783391], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 396.8, 201, 1341, 210.0, 945.1000000000008, 1322.9499999999998, 1341.0, 0.11444200937280057, 13.850869455284647, 0.2544546552148363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 120.06250000000001, 104, 305, 106.0, 179.70000000000013, 305.0, 305.0, 0.09583191082840697, 0.07440075108260112, 0.03406524955228529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72cf2b47-eb8b-4a21-8e45-2977652280dd", 3, 0, 0.0, 346.0, 199, 618, 221.0, 618.0, 618.0, 618.0, 0.03147128245476003, 0.03156348347757671, 0.020181779438762128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 437.49999999999994, 194, 1174, 393.5, 1045.9, 1174.0, 1174.0, 0.0896926345529663, 20.23236239012652, 0.1974179557647138], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7dfb82f4-fb23-4c0c-bc1f-d081e23b5520", 3, 0, 0.0, 391.0, 299, 511, 363.0, 511.0, 511.0, 511.0, 0.024591978096744842, 0.02466402490757515, 0.0157702463706339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 104.16666666666666, 99, 118, 101.5, 118.0, 118.0, 118.0, 0.03519866714380415, 0.026158384469174765, 0.01766808096866732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 101.33333333333333, 98, 106, 100.5, 106.0, 106.0, 106.0, 0.03520259091069102, 0.009419443271024747, 0.020076477628753475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 101.16666666666666, 98, 103, 102.0, 103.0, 103.0, 103.0, 0.03520341707835107, 0.009488421009399313, 0.020695758868327488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 98.66666666666667, 95, 101, 99.0, 101.0, 101.0, 101.0, 0.03520403672954499, 0.009488588024760172, 0.020730502097573857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 106.66666666666667, 106, 108, 106.0, 108.0, 108.0, 108.0, 0.016650848360723978, 0.004910699418885393, 0.010292956066736601], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1165.8947368421052, 781, 1825, 1070.0, 1664.6000000000001, 1759.6999999999996, 1825.0, 0.2444819984044333, 292.48546578646, 0.482756446068129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1001.8000000000001, 185, 1727, 1009.0, 1676.4, 1725.5, 1727.0, 0.09947318998583503, 0.030992115754961722, 0.04487950563814041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 147.22222222222223, 98, 306, 103.0, 306.0, 306.0, 306.0, 0.07013005228585009, 0.018902240655170533, 0.04129728664879649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 101.22222222222223, 97, 105, 103.0, 105.0, 105.0, 105.0, 0.0701322382314208, 0.018902829835812637, 0.041230085366518864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 140.12500000000003, 96, 304, 105.0, 303.3, 304.0, 304.0, 0.09454309096818034, 0.025482317487517354, 0.05558099683871539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 113.125, 95, 292, 100.0, 163.90000000000015, 292.0, 292.0, 0.09454364962123452, 0.02548246806197336, 0.0556736530484418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 124.77777777777777, 97, 304, 103.0, 304.0, 304.0, 304.0, 0.07013059875946763, 0.018765414121185677, 0.03999635710500889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 103.87499999999999, 96, 113, 103.0, 111.6, 113.0, 113.0, 0.09453973918849451, 0.07025853664301203, 0.04745451752234978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 104.44444444444446, 99, 120, 103.0, 120.0, 120.0, 120.0, 0.0701322382314208, 0.0521197590762805, 0.03520309614350614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 126.4375, 95, 303, 102.5, 297.4, 303.0, 303.0, 0.0945464429855403, 0.025298559939490275, 0.05392101826519095], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 645.2666666666668, 100, 1640, 442.0, 1523.6000000000001, 1640.0, 1640.0, 0.08325655229066527, 0.01648870000444035, 0.05665348206653864], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 136.88888888888889, 106, 310, 110.0, 310.0, 310.0, 310.0, 0.0702537722372704, 0.05529740275707026, 0.024973020599967213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1413.625, 842, 2211, 1302.5, 1944.0, 2157.75, 2211.0, 0.10704632429683945, 0.05540483581770011, 0.049237127679503306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 254.33333333333334, 204, 414, 209.0, 414.0, 414.0, 414.0, 0.07007544789890448, 0.10860325763238421, 0.15760132471794633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e9cf7c5-185d-4bb5-bee4-f9e5474ef5e6", 3, 0, 0.0, 718.0, 354, 1360, 440.0, 1360.0, 1360.0, 1360.0, 0.07150347983601868, 0.0331913939603394, 0.04585346851463438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98cb6b4c-90d6-44ec-8104-05affd3f6d6d", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.24714646032831739, 0.9431643296853626], "isController": false}, {"data": ["addBook", 57, 13, 22.80701754385965, 1025.80701754386, 509, 3013, 831.0, 1750.6000000000001, 1920.9999999999986, 3013.0, 0.2606345766059891, 83.1294625097738, 0.9456621561452603], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0718287a-4bae-4387-b7c2-de5dbb38cbc7", 3, 0, 0.0, 593.3333333333334, 255, 1086, 439.0, 1086.0, 1086.0, 1086.0, 0.022234245184433062, 0.0262801250861577, 0.01425828874131938], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 185.08771929824562, 100, 528, 105.0, 407.4, 421.19999999999993, 528.0, 0.24567482996715714, 0.18257670469238924, 0.11875882893920194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26c5c959-dcfd-43b6-8cd5-5f5ffd919f87", 3, 0, 0.0, 706.6666666666667, 212, 1640, 268.0, 1640.0, 1640.0, 1640.0, 0.020360931444743827, 0.02806918771760745, 0.013056977521531685], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 639.4385964912278, 479, 976, 601.0, 812.0, 878.5999999999999, 976.0, 0.24531322625626192, 72.13023368505655, 0.12337530422067862], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 168.859649122807, 96, 427, 106.0, 305.0, 308.2, 427.0, 0.2460544945954346, 0.43540111738957765, 0.11966322100442034], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 977.9298245614035, 678, 1416, 957.0, 1228.8, 1350.2999999999997, 1416.0, 0.2449632125421165, 220.41832924479345, 0.12296005004555458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 111.125, 100, 161, 106.0, 135.10000000000002, 161.0, 161.0, 0.09277567421821999, 0.0693099519306038, 0.032978852944757886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, 7.60233918128655, 167.94152046783628, 96, 1538, 107.0, 299.0, 374.2000000000001, 1185.9200000000005, 0.7046141928252968, 1.6066888837324773, 0.33563979020215423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 106.33333333333334, 100, 113, 106.5, 113.0, 113.0, 113.0, 0.034429136230353874, 0.02666240725651428, 0.012238482019383604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/148b0bce-6087-42fc-85b2-7ecb39eadc03", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.9046343838526912, 1.6903107294617565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 106.0, 101, 115, 105.0, 111.8, 115.0, 115.0, 0.09429357472488463, 0.07652144589490148, 0.03351841914048633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98cb6b4c-90d6-44ec-8104-05affd3f6d6d", 3, 0, 0.0, 449.6666666666667, 336, 571, 442.0, 571.0, 571.0, 571.0, 0.03174032184686353, 0.026460600341737466, 0.020354307955182668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 207.66666666666666, 201, 223, 204.0, 223.0, 223.0, 223.0, 0.035178030147571836, 0.054519076019723146, 0.07911621428697065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=100f3614-1482-408b-8251-5919d6598947", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 246.125, 197, 414, 210.0, 411.2, 414.0, 414.0, 0.09448335321420558, 0.14643074370209397, 0.21249527583233926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f173080-8740-4e5b-b621-7dd8d9d1cde6", 3, 0, 0.0, 524.3333333333333, 206, 1050, 317.0, 1050.0, 1050.0, 1050.0, 0.1116528341211061, 0.051755740816554395, 0.07160028750604787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2110429-3a38-4676-bbbf-9d8662b682a4", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ccb63de-cf77-443a-aa3d-5cd3cdc03939", 3, 0, 0.0, 533.6666666666666, 410, 734, 457.0, 734.0, 734.0, 734.0, 0.03581875708912901, 0.02986062399259746, 0.022969710763536506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 139.6923076923077, 103, 306, 111.0, 305.6, 306.0, 306.0, 0.05974841322002583, 0.04953750275761907, 0.021238693761806055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb48be96-b0c7-4f53-8a38-66cab79f2f2f", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 118.76470588235296, 101, 297, 109.0, 157.79999999999987, 297.0, 297.0, 0.08602107010211207, 0.06678393626091708, 0.030577802262860148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c2c7647-50ec-4a97-8833-f17a61eec00f", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.5942896792763158, 2.2679379111842106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 102.68749999999999, 95, 111, 102.5, 108.9, 111.0, 111.0, 0.08974445267101927, 0.06669485203383366, 0.04504750846963272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 188.06249999999997, 98, 318, 103.0, 307.5, 318.0, 318.0, 0.08974646623289208, 0.04928825092551043, 0.0497702876093785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 271.3125, 93, 1072, 101.5, 943.2000000000002, 1072.0, 1072.0, 0.08974596283395314, 15.160949173986571, 0.051314708241483944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 270.75, 95, 778, 104.0, 778.0, 778.0, 778.0, 0.08974646623289208, 4.967486625673098, 0.05140263910702266], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.0, 0.6736526946107785], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 13.88888888888889, 0.37425149700598803], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.2245508982035928], "isController": false}, {"data": ["401/Unauthorized", 19, 52.77777777777778, 1.4221556886227544], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1336, 36, "401/Unauthorized", 19, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

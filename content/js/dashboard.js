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

    var data = {"OkPercent": 99.02548725637182, "KoPercent": 0.974512743628186};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8361128928800513, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d627f627-fd53-4623-9e02-4ce9f6c7abb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20dc275c-bdaf-4a00-b037-f80cd3cf7069"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8c80fb8-77b9-4214-9f36-c083d1f95570"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ecbc289a-3e3b-46e3-b589-7533519172cb"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ba802b4-64bb-455a-9d12-defe1250a2dd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0150066c-220f-43b2-bc51-c19b6b4c4332"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/161d7a43-a390-4297-8611-d99580239142"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=caf06ab7-062c-442a-a5d7-6f60c2ded497"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17d62042-f71f-4835-83cd-4269781448d0"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.9, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=366080d8-3e2f-4f99-8ea1-2289badf35b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03634281-05d0-422b-8f3e-0f75eb53e298"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5aada9f8-2e67-4a6a-b0bd-219a77dfea6d"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f2a55373-3c82-4bc5-9f31-511654165716"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7844d3b-4479-43b1-987e-af2436b4faff"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65b1cdda-209a-4dbe-90e0-42c18b5c6170"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0150066c-220f-43b2-bc51-c19b6b4c4332"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d627f627-fd53-4623-9e02-4ce9f6c7abb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=161d7a43-a390-4297-8611-d99580239142"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5aada9f8-2e67-4a6a-b0bd-219a77dfea6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8c80fb8-77b9-4214-9f36-c083d1f95570"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/caf06ab7-062c-442a-a5d7-6f60c2ded497"], "isController": false}, {"data": [0.4016393442622951, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97a627ad-827b-447d-82cb-ac48d7733f35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8660714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20dc275c-bdaf-4a00-b037-f80cd3cf7069"], "isController": false}, {"data": [0.9466292134831461, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ba802b4-64bb-455a-9d12-defe1250a2dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17d62042-f71f-4835-83cd-4269781448d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97a627ad-827b-447d-82cb-ac48d7733f35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03634281-05d0-422b-8f3e-0f75eb53e298"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecbc289a-3e3b-46e3-b589-7533519172cb"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/366080d8-3e2f-4f99-8ea1-2289badf35b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7844d3b-4479-43b1-987e-af2436b4faff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9033194-b014-483c-9ea7-8ac6f6981284"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d5e5c9a-b2ea-4e33-862d-9accde21e6c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65b1cdda-209a-4dbe-90e0-42c18b5c6170"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1334, 13, 0.974512743628186, 275.70914542728553, 76, 2972, 101.0, 705.5, 824.25, 1307.2000000000062, 5.205284885944169, 740.9116371247726, 3.791407365731744], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1200.2857142857144, 966, 1500, 1186.0, 1415.5, 1435.1, 1500.0, 0.24348355399030414, 292.99276971374377, 1.19720673275506], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d627f627-fd53-4623-9e02-4ce9f6c7abb7", 3, 0, 0.0, 270.3333333333333, 197, 358, 256.0, 358.0, 358.0, 358.0, 0.08291644785937372, 0.03751753337387027, 0.05317233147231973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20dc275c-bdaf-4a00-b037-f80cd3cf7069", 3, 0, 0.0, 275.3333333333333, 167, 464, 195.0, 464.0, 464.0, 464.0, 0.022434938677834283, 0.030913768041429854, 0.014386988670355969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8c80fb8-77b9-4214-9f36-c083d1f95570", 3, 0, 0.0, 267.6666666666667, 179, 373, 251.0, 373.0, 373.0, 373.0, 0.03301637612255679, 0.027524394287066385, 0.021172610990051063], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 522.4666666666667, 365, 776, 456.0, 769.4, 776.0, 776.0, 0.08446231291597689, 0.015259304579546606, 0.057407978310078045], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 522.4666666666667, 365, 776, 456.0, 769.4, 776.0, 776.0, 0.08395130824122009, 0.01516698439904855, 0.057060654820204275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 112.66666666666667, 78, 243, 82.0, 239.4, 243.0, 243.0, 0.1282336245661429, 0.059992631909655134, 0.07169728956862209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 93.93333333333332, 80, 246, 83.0, 150.60000000000005, 246.0, 246.0, 0.12822485510591372, 0.09529210423398472, 0.06436286672308561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 178.66666666666666, 79, 561, 83.0, 560.4, 561.0, 561.0, 0.1282336245661429, 5.057280357173389, 0.07404323022637509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 167.13333333333335, 79, 731, 82.0, 722.0, 731.0, 731.0, 0.12823252831801668, 15.414468235734132, 0.07391737016456508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecbc289a-3e3b-46e3-b589-7533519172cb", 3, 0, 0.0, 236.33333333333331, 162, 369, 178.0, 369.0, 369.0, 369.0, 0.040326916872782025, 0.03322507376465211, 0.025860685624798367], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 215.2, 156, 443, 178.0, 365.00000000000006, 443.0, 443.0, 0.08500172836847683, 0.15211214242606266, 0.054952289238214505], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 101.05882352941177, 78, 241, 83.0, 238.6, 241.0, 241.0, 0.08401534021270707, 0.062437181544795, 0.04217176256770648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 119.41176470588236, 79, 245, 82.0, 244.2, 245.0, 245.0, 0.08401492500432431, 0.05217149237688107, 0.04625454051249104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 547.4, 403, 657, 563.0, 657.0, 657.0, 657.0, 0.049412973870419416, 14.52905498305135, 0.028180836660473572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ba802b4-64bb-455a-9d12-defe1250a2dd", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 715.2, 546, 802, 728.0, 802.0, 802.0, 802.0, 0.04933545146871639, 44.392125954024294, 0.0280884455139274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 80.0, 78, 82, 81.0, 82.0, 82.0, 82.0, 0.04964109488398876, 0.08784146868143324, 0.02748681718673987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 83.88235294117646, 81, 91, 83.0, 89.4, 91.0, 91.0, 0.0945736951611647, 0.07028377150160775, 0.047471561828944006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 109.47058823529412, 79, 245, 81.0, 245.0, 245.0, 245.0, 0.09458053532582995, 0.025307682303981838, 0.05394046155301239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 111.11764705882352, 80, 245, 82.0, 244.2, 245.0, 245.0, 0.09458000912418912, 0.0254922680842541, 0.055602700676525244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0150066c-220f-43b2-bc51-c19b6b4c4332", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.0883377259036144, 4.153332078313253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/161d7a43-a390-4297-8611-d99580239142", 3, 0, 0.0, 323.0, 225, 395, 349.0, 395.0, 395.0, 395.0, 0.08855565723056942, 0.04006912875992561, 0.056788621336009676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 120.41176470588235, 80, 251, 83.0, 245.4, 251.0, 251.0, 0.0945784305543965, 0.025491842610364683, 0.05569413439873153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 82.2, 78, 86, 84.0, 86.0, 86.0, 86.0, 0.049637152415840206, 0.0368885478402875, 0.027872424452254026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=caf06ab7-062c-442a-a5d7-6f60c2ded497", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 439.9999999999999, 79, 823, 624.5, 740.2000000000002, 823.0, 823.0, 0.09022104155180193, 45.11139205115032, 0.048732676306952036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 230.47058823529414, 76, 727, 83.0, 707.8, 727.0, 727.0, 0.08401658586247968, 17.805145459891964, 0.04769369838539891], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17d62042-f71f-4835-83cd-4269781448d0", 3, 0, 0.0, 329.0, 178, 443, 366.0, 443.0, 443.0, 443.0, 0.029992202027472856, 0.024554162792673907, 0.01923328059704477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 338.1111111111111, 78, 652, 390.0, 651.1, 652.0, 652.0, 0.09021878054281633, 14.74820580532792, 0.048819559306317824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 192.05882352941174, 80, 568, 83.0, 560.8, 568.0, 568.0, 0.08401492500432431, 5.829828850478144, 0.04777480139118832], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 357.0666666666666, 166, 636, 355.0, 633.6, 636.0, 636.0, 0.08399879041741799, 0.015175562721896803, 0.05791322854950888], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 224.23529411764704, 163, 343, 168.0, 333.4, 343.0, 343.0, 0.09453004665335832, 0.14650310941296843, 0.2126002904713713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 512.5652173913044, 86, 1646, 341.0, 1192.2000000000003, 1565.3999999999987, 1646.0, 0.1038459107286371, 0.0637881619612429, 0.04695376627671775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 92.66666666666669, 78, 251, 82.5, 118.70000000000022, 251.0, 251.0, 0.09022013713460844, 0.06704836363226271, 0.04528627977264525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 118.6111111111111, 80, 250, 82.5, 247.3, 250.0, 250.0, 0.09022104155180193, 0.09942327452258033, 0.04724465565635808], "isController": false}, {"data": ["login", 23, 0, 0.0, 2145.0, 1388, 3722, 1936.0, 3256.0000000000005, 3663.999999999999, 3722.0, 0.1036890770319678, 27.110269071746078, 0.19382267392715616], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=366080d8-3e2f-4f99-8ea1-2289badf35b5", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 90.94117647058823, 83, 147, 85.0, 118.19999999999997, 147.0, 147.0, 0.08311007685237694, 0.06728345088927783, 0.02954303513111837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03634281-05d0-422b-8f3e-0f75eb53e298", 3, 0, 0.0, 597.6666666666667, 274, 1169, 350.0, 1169.0, 1169.0, 1169.0, 0.11195283054073218, 0.05196768761428518, 0.07179266802253984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5aada9f8-2e67-4a6a-b0bd-219a77dfea6d", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 535.1666666666667, 164, 906, 712.0, 828.6000000000001, 906.0, 906.0, 0.09018126434132606, 59.99997494964879, 0.19000104272086893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2a55373-3c82-4bc5-9f31-511654165716", 1, 0, 0.0, 1213.0, 1213, 1213, 1213.0, 1213.0, 1213.0, 1213.0, 0.8244023083264633, 0.2632612840065952, 0.49190411170651277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7844d3b-4479-43b1-987e-af2436b4faff", 3, 0, 0.0, 263.6666666666667, 178, 346, 267.0, 346.0, 346.0, 346.0, 0.07980845969672784, 0.03611124966746475, 0.05117925312583133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65b1cdda-209a-4dbe-90e0-42c18b5c6170", 3, 0, 0.0, 354.6666666666667, 211, 593, 260.0, 593.0, 593.0, 593.0, 0.07210498485795318, 0.03262562791424314, 0.04623919927414315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 306.13333333333327, 161, 817, 170.0, 805.0, 817.0, 817.0, 0.12813613182645242, 20.611489312912706, 0.2838098529210767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 803.2, 658, 883, 812.0, 883.0, 883.0, 883.0, 0.04929313642368437, 58.9717282296863, 0.1111502460959836], "isController": false}, {"data": ["register", 25, 6, 24.0, 883.92, 221, 2972, 789.0, 1458.6000000000001, 2527.699999999999, 2972.0, 0.09970049969890449, 0.03148354842054468, 0.04498206138759167], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0150066c-220f-43b2-bc51-c19b6b4c4332", 3, 0, 0.0, 482.66666666666663, 313, 805, 330.0, 805.0, 805.0, 805.0, 0.10515247108307045, 0.047578754819488256, 0.06743176042762004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 88.6470588235294, 83, 109, 86.0, 105.0, 109.0, 109.0, 0.08249383722510142, 0.0640455083925348, 0.02932398120111027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 348.5294117647059, 159, 969, 167.0, 839.3999999999999, 969.0, 969.0, 0.08398172162529331, 23.739844811349883, 0.1838209753612449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 287.82352941176475, 164, 972, 168.0, 701.5999999999998, 972.0, 972.0, 0.10132920069142279, 14.40032415099541, 0.2248416265571914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d627f627-fd53-4623-9e02-4ce9f6c7abb7", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.9078596105527638, 3.4645885678391957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 110.81818181818183, 80, 240, 83.0, 239.4, 240.0, 240.0, 0.054410193502433625, 0.04043570044467967, 0.02731136666040125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 95.27272727272727, 78, 235, 82.0, 204.80000000000013, 235.0, 235.0, 0.054411539203514, 0.014559337638440268, 0.031031580952004076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=161d7a43-a390-4297-8611-d99580239142", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 110.27272727272728, 80, 242, 81.0, 241.4, 242.0, 242.0, 0.05441180835171793, 0.014665682719798973, 0.03198819201927167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 125.63636363636365, 80, 247, 83.0, 246.0, 247.0, 247.0, 0.05441207750258457, 0.014665755264368498, 0.032041487044979], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 780.2321428571429, 626, 1153, 657.0, 1060.0, 1085.5, 1153.0, 0.23827151038608496, 285.05556300154024, 0.4704931582037732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, 24.0, 883.92, 221, 2972, 789.0, 1458.6000000000001, 2527.699999999999, 2972.0, 0.09882672907245185, 0.031207628039910187, 0.044587840655735116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 113.4, 81, 236, 82.0, 236.0, 236.0, 236.0, 0.02246908254242163, 0.00605611990401208, 0.013231305442461174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 81.6, 79, 84, 82.0, 84.0, 84.0, 84.0, 0.022484946328433113, 0.0060603956900854876, 0.013218689150113998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5aada9f8-2e67-4a6a-b0bd-219a77dfea6d", 3, 0, 0.0, 517.3333333333334, 163, 867, 522.0, 867.0, 867.0, 867.0, 0.05297639018877254, 0.03405871439545109, 0.03397248980204489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 114.1764705882353, 79, 327, 82.0, 255.79999999999993, 327.0, 327.0, 0.0810326418547895, 0.021840829249923734, 0.04763833046541336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 124.76470588235294, 79, 333, 83.0, 262.5999999999999, 333.0, 333.0, 0.08103109687505959, 0.021840412829605905, 0.04771655411685637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 111.8, 79, 235, 82.0, 235.0, 235.0, 235.0, 0.02246908254242163, 0.006012234977171412, 0.012814398637474834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 98.11764705882352, 79, 344, 82.0, 145.59999999999982, 344.0, 344.0, 0.08103109687505959, 0.06021939914250034, 0.040673812298613894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 82.6, 80, 86, 82.0, 86.0, 86.0, 86.0, 0.02248444076698924, 0.016709628343436343, 0.011286135306867647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 100.29411764705881, 78, 242, 82.0, 240.4, 242.0, 242.0, 0.08103302810892746, 0.021682665724459104, 0.04621414884337269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 88.6, 83, 98, 87.0, 98.0, 98.0, 98.0, 0.02156929567621899, 0.01697739483889893, 0.007667210572405969], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 510.4666666666667, 346, 1169, 391.0, 950.6000000000001, 1169.0, 1169.0, 0.08242211110500577, 0.014890713432056706, 0.05610176898455959], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8c80fb8-77b9-4214-9f36-c083d1f95570", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.5441688629518072, 2.0766660391566263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1180.4347826086957, 741, 2011, 1145.0, 1607.4, 1930.599999999999, 2011.0, 0.10385247530117218, 0.05375176944298951, 0.04776808190122275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 197.8, 165, 316, 168.0, 316.0, 316.0, 316.0, 0.022460604100407885, 0.03480954951889386, 0.05051442504222594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/caf06ab7-062c-442a-a5d7-6f60c2ded497", 3, 0, 0.0, 254.0, 156, 391, 215.0, 391.0, 391.0, 391.0, 0.019089676939033934, 0.026316660754169503, 0.012241752464159133], "isController": false}, {"data": ["addBook", 61, 7, 11.475409836065573, 894.704918032787, 421, 3426, 683.0, 1518.8000000000006, 1961.8999999999996, 3426.0, 0.2814029551923458, 100.43409505307444, 1.020446115947244], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/97a627ad-827b-447d-82cb-ac48d7733f35", 3, 0, 0.0, 242.66666666666669, 167, 376, 185.0, 376.0, 376.0, 376.0, 0.0322622273841786, 0.02658063069966017, 0.020688993472275992], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 153.66071428571428, 78, 498, 84.0, 331.3, 340.3, 498.0, 0.23901083658060854, 0.17762426429476866, 0.11553746494863401], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 445.6785714285714, 387, 643, 403.0, 566.0, 568.4, 643.0, 0.23896799962447884, 70.26452637395931, 0.12018410137363926], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 126.875, 79, 332, 84.0, 248.3, 260.9999999999999, 332.0, 0.23913331255150974, 0.4231538694759137, 0.1162972555182147], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 624.839285714286, 542, 796, 568.0, 730.3, 745.0999999999999, 796.0, 0.23863399085520456, 214.7232844453251, 0.11978307744099134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 87.29411764705884, 81, 113, 84.0, 102.6, 113.0, 113.0, 0.09969797378529748, 0.074481396431399, 0.03543951411899247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20dc275c-bdaf-4a00-b037-f80cd3cf7069", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 7, 3.932584269662921, 169.24719101123594, 81, 2916, 88.0, 251.59999999999997, 336.7499999999998, 1690.7100000000123, 0.7333734354013366, 1.5761622346671391, 0.35373503511334325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ba802b4-64bb-455a-9d12-defe1250a2dd", 3, 0, 0.0, 356.33333333333337, 167, 730, 172.0, 730.0, 730.0, 730.0, 0.05046087600080738, 0.032441481152862814, 0.03235935082083025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 92.90909090909089, 84, 131, 86.0, 125.80000000000001, 131.0, 131.0, 0.05738521652485562, 0.04443991865645557, 0.02039865118656977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17d62042-f71f-4835-83cd-4269781448d0", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.28586085838607594, 1.0909068433544304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97a627ad-827b-447d-82cb-ac48d7733f35", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 96.46666666666667, 82, 236, 85.0, 156.20000000000005, 236.0, 236.0, 0.12435130071460548, 0.10091399501351284, 0.044203001425894915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03634281-05d0-422b-8f3e-0f75eb53e298", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 238.1818181818182, 163, 484, 166.0, 483.8, 484.0, 484.0, 0.05438786458410589, 0.08429056747556254, 0.12231958216523033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecbc289a-3e3b-46e3-b589-7533519172cb", 1, 0, 0.0, 636.0, 636, 636, 636.0, 636.0, 636.0, 636.0, 1.5723270440251573, 0.28406299135220126, 1.084045794025157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 248.29411764705884, 164, 585, 167.0, 447.39999999999986, 585.0, 585.0, 0.08099866590432628, 0.1255321120997713, 0.18216789802506195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/366080d8-3e2f-4f99-8ea1-2289badf35b5", 3, 0, 0.0, 365.3333333333333, 162, 488, 446.0, 488.0, 488.0, 488.0, 0.01647012319652151, 0.022705394445725453, 0.01056189540922766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 115.23529411764706, 80, 248, 86.0, 245.6, 248.0, 248.0, 0.09242897920347969, 0.076633011077885, 0.032855613701236915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7844d3b-4479-43b1-987e-af2436b4faff", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 0.719777141434263, 2.746825199203187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9033194-b014-483c-9ea7-8ac6f6981284", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 104.5, 82, 247, 85.5, 244.3, 247.0, 247.0, 0.08925118257816916, 0.06929168959926219, 0.03172600630708357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d5e5c9a-b2ea-4e33-862d-9accde21e6c1", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.6794381648936171, 1.26953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 91.88235294117646, 79, 244, 82.0, 116.79999999999988, 244.0, 244.0, 0.10147436280069241, 0.07541209969856146, 0.050935373515191305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 128.1176470588235, 78, 242, 82.0, 241.2, 242.0, 242.0, 0.10137935558510797, 0.04504066728488195, 0.05681623351840035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65b1cdda-209a-4dbe-90e0-42c18b5c6170", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 155.99999999999997, 79, 728, 82.0, 578.3999999999999, 728.0, 728.0, 0.10147315139794189, 10.76598192807941, 0.05862919099037795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 166.11764705882354, 78, 555, 83.0, 433.39999999999986, 555.0, 555.0, 0.10147315139794189, 3.5343061325597493, 0.05872828586479001], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 46.15384615384615, 0.4497751124437781], "isController": false}, {"data": ["401/Unauthorized", 7, 53.84615384615385, 0.5247376311844077], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1334, 13, "401/Unauthorized", 7, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 98.46625766871166, "KoPercent": 1.5337423312883436};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7653465346534654, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.026785714285714284, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/507c0aed-04d3-48b8-8b75-204100498507"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbe0cf48-9144-4de9-b6ae-91b11681080e"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e40b09ea-4b6a-4810-bdfa-1b513220d57e"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6e32c9c6-79fb-4cbd-97d8-d3d7da21c804"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee730dc6-c0ea-4fe5-8eed-7f71348ade3e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82a56731-4e59-43a8-b03a-81ef3d16b4f5"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2fde4f21-b91d-4af4-8400-14018fd44dfa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f85340d-473b-431f-897d-4462c0d6b850"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f892b215-6a7e-4e63-840b-818dea149ff8"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d8f5ba0-cf50-4df6-961a-50ac7bf25aa2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4cf34e03-76a0-4a7d-a504-d7dcc6b7b8e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27186e15-40f3-4451-98d2-a505bab84daa"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de697b47-0b6c-4f13-9c78-e60658dfd923"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d3c7bd8-cc4c-4a36-8eb9-c8f7373ae745"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbe0cf48-9144-4de9-b6ae-91b11681080e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e32c9c6-79fb-4cbd-97d8-d3d7da21c804"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2fde4f21-b91d-4af4-8400-14018fd44dfa"], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73a55040-36dd-48f5-bbc8-9003106de640"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=507c0aed-04d3-48b8-8b75-204100498507"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9235294117647059, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82a56731-4e59-43a8-b03a-81ef3d16b4f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e40b09ea-4b6a-4810-bdfa-1b513220d57e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cf34e03-76a0-4a7d-a504-d7dcc6b7b8e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f85340d-473b-431f-897d-4462c0d6b850"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f892b215-6a7e-4e63-840b-818dea149ff8"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27186e15-40f3-4451-98d2-a505bab84daa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d8f5ba0-cf50-4df6-961a-50ac7bf25aa2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de697b47-0b6c-4f13-9c78-e60658dfd923"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 20, 1.5337423312883436, 419.8381901840483, 107, 6833, 132.5, 1148.5, 1397.0, 1986.0000000000027, 5.263391577766208, 756.677550445461, 3.85573264170592], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1929.7857142857147, 1311, 2741, 1955.0, 2301.1, 2493.05, 2741.0, 0.2553486420923997, 307.2695920235468, 1.2555472782570631], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/507c0aed-04d3-48b8-8b75-204100498507", 3, 0, 0.0, 689.0, 215, 1418, 434.0, 1418.0, 1418.0, 1418.0, 0.023888583645875636, 0.028235497141332826, 0.015319176361450196], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 645.3846153846155, 113, 1233, 507.0, 1220.6, 1233.0, 1233.0, 0.0900988314874624, 0.01706950518414815, 0.06090740569078081], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 645.3846153846155, 113, 1233, 507.0, 1220.6, 1233.0, 1233.0, 0.08923178298830378, 0.01690524013645599, 0.06032127517365878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 180.71428571428572, 110, 356, 115.0, 355.0, 356.0, 356.0, 0.0913152659557121, 0.05382352101881747, 0.050434868571242214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 116.5, 108, 133, 115.5, 127.0, 133.0, 133.0, 0.09131586156515387, 0.06786266665144736, 0.04583628207469638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 280.5, 111, 901, 116.0, 790.5, 901.0, 901.0, 0.09131764844009888, 5.773000326949795, 0.052092336003287436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 376.57142857142856, 107, 1346, 114.0, 1281.5, 1346.0, 1346.0, 0.0913188397289135, 17.626950258546465, 0.05200383702196218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbe0cf48-9144-4de9-b6ae-91b11681080e", 3, 0, 0.0, 295.6666666666667, 204, 423, 260.0, 423.0, 423.0, 423.0, 0.03781290176208122, 0.03152306035569336, 0.024248507965917973], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 232.3076923076923, 109, 421, 226.0, 356.5999999999999, 421.0, 421.0, 0.09014506421102265, 0.18914075935081687, 0.05827060378123874], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 116.35714285714285, 109, 127, 116.0, 125.5, 127.0, 127.0, 0.06780810306831667, 0.05039254534666893, 0.03403648923546364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 179.92857142857144, 110, 345, 115.5, 344.5, 345.0, 345.0, 0.06780843149411035, 0.025418701928665532, 0.038265221176573154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 815.5, 563, 960, 884.5, 960.0, 960.0, 960.0, 0.08397892129075601, 24.692591222103253, 0.047894228548634295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e40b09ea-4b6a-4810-bdfa-1b513220d57e", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1142.75, 899, 1653, 1095.5, 1653.0, 1653.0, 1653.0, 0.083629521220991, 75.24999019966549, 0.04761329186702906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 226.5, 111, 342, 225.5, 342.0, 342.0, 342.0, 0.08418217021634818, 0.14896298089064736, 0.04661258839127873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 127.06250000000003, 110, 341, 112.5, 184.90000000000015, 341.0, 341.0, 0.0783975539963153, 0.0582622447179648, 0.03935189722080671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 112.6875, 108, 117, 114.0, 117.0, 117.0, 117.0, 0.07839870642134404, 0.0209777788666487, 0.04471176225592278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 181.68750000000003, 108, 342, 115.5, 334.3, 342.0, 342.0, 0.078396785731785, 0.021130383654270175, 0.04608873536185017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 206.75000000000003, 112, 458, 116.5, 377.5000000000001, 458.0, 458.0, 0.07839793813422707, 0.02113069426274089, 0.04616597333490129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 169.0, 109, 347, 114.5, 347.0, 347.0, 347.0, 0.08437394532568343, 0.06270368397738778, 0.04737794781471481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 767.8823529411766, 109, 1654, 960.0, 1499.6, 1654.0, 1654.0, 0.10184031438704111, 53.91488723806072, 0.05472278841776095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 193.21428571428572, 108, 1227, 114.0, 671.5, 1227.0, 1227.0, 0.06780843149411035, 4.375124302844564, 0.039447706379804715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 540.5882352941177, 109, 997, 671.0, 932.1999999999999, 997.0, 997.0, 0.10183787410442575, 17.625253097069468, 0.05482092820729399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 211.57142857142858, 111, 674, 115.5, 565.0, 674.0, 674.0, 0.06780974522910006, 1.441136827351545, 0.03951469110239272], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 465.53846153846143, 111, 880, 474.0, 782.8, 880.0, 880.0, 0.08914367217071699, 0.016888547266717867, 0.06097153959693346], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6e32c9c6-79fb-4cbd-97d8-d3d7da21c804", 3, 0, 0.0, 1201.6666666666667, 231, 2422, 952.0, 2422.0, 2422.0, 2422.0, 0.06796248470844095, 0.03075125447419691, 0.04358271317566036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee730dc6-c0ea-4fe5-8eed-7f71348ade3e", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.7567202310426541, 1.4139329087677726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82a56731-4e59-43a8-b03a-81ef3d16b4f5", 3, 0, 0.0, 417.0, 243, 613, 395.0, 613.0, 613.0, 613.0, 0.052910052910052914, 0.03401606591710758, 0.03392994929453263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 335.125, 223, 683, 232.5, 603.2, 683.0, 683.0, 0.07835340323109846, 0.12143247160913405, 0.17621864027462866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2fde4f21-b91d-4af4-8400-14018fd44dfa", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f85340d-473b-431f-897d-4462c0d6b850", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f892b215-6a7e-4e63-840b-818dea149ff8", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 706.217391304348, 220, 1714, 676.0, 1265.4000000000003, 1639.399999999999, 1714.0, 0.09948570217441141, 0.061109869792680446, 0.04498230479175047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 114.88235294117646, 109, 119, 115.0, 117.4, 119.0, 119.0, 0.10183787410442575, 0.0756822482358086, 0.051117839150073084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 206.11764705882354, 108, 352, 116.0, 345.6, 352.0, 352.0, 0.10183848416411571, 0.11722423860756839, 0.05304867729780568], "isController": false}, {"data": ["login", 23, 0, 0.0, 3560.1304347826085, 2408, 7776, 3250.0, 4885.600000000001, 7253.1999999999925, 7776.0, 0.0986315938436732, 41.174846008743906, 0.20570164988142767], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 120.14285714285715, 116, 133, 117.5, 131.0, 133.0, 133.0, 0.07224687790277634, 0.058488927520899986, 0.02568150737950253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d8f5ba0-cf50-4df6-961a-50ac7bf25aa2", 3, 0, 0.0, 376.3333333333333, 233, 557, 339.0, 557.0, 557.0, 557.0, 0.02894300158221742, 0.02921622653204955, 0.018560453488596456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4cf34e03-76a0-4a7d-a504-d7dcc6b7b8e6", 3, 0, 0.0, 339.3333333333333, 213, 499, 306.0, 499.0, 499.0, 499.0, 0.052883937385418134, 0.03399927615110704, 0.03391320203426879], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27186e15-40f3-4451-98d2-a505bab84daa", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 884.8235294117649, 228, 1771, 1070.0, 1614.1999999999998, 1771.0, 1771.0, 0.10176898440539975, 71.68323023923195, 0.21356403775928642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de697b47-0b6c-4f13-9c78-e60658dfd923", 3, 0, 0.0, 604.6666666666667, 217, 1313, 284.0, 1313.0, 1313.0, 1313.0, 0.016852039096730706, 0.023231896345916186, 0.010806808925963375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 528.2142857142858, 224, 1464, 337.5, 1407.5, 1464.0, 1464.0, 0.09124682265528254, 23.5031663971355, 0.20021345238871147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 2, 20.0, 1072.9, 109, 1766, 1208.0, 1749.1000000000001, 1766.0, 1766.0, 0.10440920053875148, 99.93334940799983, 0.20218066772293974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d3c7bd8-cc4c-4a36-8eb9-c8f7373ae745", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.9229362355491331, 1.7245077673410405], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1148.5652173913045, 346, 2082, 1076.0, 1895.4, 2051.3999999999996, 2082.0, 0.09817312617380912, 0.030629081654430595, 0.04429295341044903], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 402.07142857142856, 227, 1342, 242.0, 957.0, 1342.0, 1342.0, 0.06777002725323238, 5.888707660372929, 0.1511778370227659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 117.28571428571429, 112, 125, 117.0, 122.5, 125.0, 125.0, 0.0716167480880886, 0.055600893291045346, 0.02545751592193774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 348.52631578947376, 223, 678, 232.0, 672.0, 678.0, 678.0, 0.08653158630614875, 0.13410705807408013, 0.19461156568658258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 115.19999999999999, 109, 121, 115.0, 120.8, 121.0, 121.0, 0.06129103434749565, 0.0455492940805119, 0.030765226225207776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 134.4, 109, 332, 113.0, 310.20000000000005, 332.0, 332.0, 0.061292912700504444, 0.016400642656189665, 0.034956114274506435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 136.1, 107, 339, 114.5, 316.70000000000005, 339.0, 339.0, 0.061292912700504444, 0.016520355376307836, 0.03603352875556999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 158.9, 110, 343, 113.0, 342.8, 343.0, 343.0, 0.061293664073944674, 0.016520557894930402, 0.0360938275747936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 2.656953828828829, 5.569045608108108], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1348.1607142857135, 862, 2266, 1353.0, 1814.1000000000001, 1901.0999999999997, 2266.0, 0.2539003169220027, 303.7530490707702, 0.5013539461096578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1148.5652173913045, 346, 2082, 1076.0, 1895.4, 2051.3999999999996, 2082.0, 0.09910802775024777, 0.030920762054552506, 0.04471475470763132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbe0cf48-9144-4de9-b6ae-91b11681080e", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 139.33333333333334, 111, 344, 114.0, 344.0, 344.0, 344.0, 0.0482307358402598, 0.012999690519445025, 0.028401497765309237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 112.66666666666667, 109, 116, 113.0, 116.0, 116.0, 116.0, 0.04828999753184457, 0.013015663397254983, 0.028389236830244562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 152.57142857142858, 109, 455, 114.0, 391.5, 455.0, 455.0, 0.07177646757241733, 0.019346001025378107, 0.042196712381440654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 145.07142857142856, 109, 342, 114.5, 333.0, 342.0, 342.0, 0.07169303092530098, 0.01932351224158503, 0.042217673484332516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 131.42857142857142, 112, 344, 116.0, 231.5, 344.0, 344.0, 0.0717772035601493, 0.053342238192650014, 0.036028791630778066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 136.88888888888889, 108, 329, 114.0, 329.0, 329.0, 329.0, 0.04823435465113163, 0.01290645817813483, 0.02750865538697351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 225.92857142857142, 108, 345, 221.5, 344.5, 345.0, 345.0, 0.07169229666272359, 0.019183290317955334, 0.04088701294045955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 145.1111111111111, 110, 343, 116.0, 343.0, 343.0, 343.0, 0.04828947933210284, 0.03588700563645534, 0.024239055055371935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 118.44444444444444, 115, 121, 118.0, 121.0, 121.0, 121.0, 0.049953376848274944, 0.03931877123018516, 0.01775686442653523], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 664.3846153846155, 120, 1313, 499.0, 1268.2, 1313.0, 1313.0, 0.08872266659386858, 0.016622170258797194, 0.060383665815839045], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1927.7826086956527, 1002, 6833, 1712.0, 3002.8000000000006, 6113.599999999989, 6833.0, 0.10062342775894127, 0.05208048507054577, 0.04628284616646615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 286.22222222222223, 225, 688, 233.0, 688.0, 688.0, 688.0, 0.04820025599691519, 0.07470098268271913, 0.10840350543056218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e32c9c6-79fb-4cbd-97d8-d3d7da21c804", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fde4f21-b91d-4af4-8400-14018fd44dfa", 3, 0, 0.0, 1030.6666666666667, 421, 2210, 461.0, 2210.0, 2210.0, 2210.0, 0.03213539713994965, 0.0322295438112581, 0.020607660275293236], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 1193.9298245614038, 579, 4274, 967.0, 2090.4, 2388.299999999997, 4274.0, 0.27694101642211644, 82.43835348393013, 1.007929979776018], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/73a55040-36dd-48f5-bbc8-9003106de640", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=507c0aed-04d3-48b8-8b75-204100498507", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 219.71428571428572, 108, 470, 117.0, 460.6, 469.0, 470.0, 0.25495337995337997, 0.1894721895942599, 0.1232440655048077], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 721.8214285714286, 535, 1137, 675.0, 930.2000000000003, 1088.3, 1137.0, 0.25447489559712994, 74.82406866732406, 0.12798297971925965], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 173.66071428571428, 109, 463, 116.0, 348.20000000000005, 459.15, 463.0, 0.2553917298685189, 0.45192364699390253, 0.12420418112746329], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1122.857142857143, 746, 1819, 1135.5, 1389.8000000000002, 1535.4499999999998, 1819.0, 0.25462531430312235, 229.11230539350976, 0.12780997221855944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 119.47368421052632, 113, 140, 118.0, 130.0, 140.0, 140.0, 0.0881089954647054, 0.06582361477587854, 0.0313199944815945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, 4.705882352941177, 204.9176470588235, 109, 2271, 121.0, 367.1, 515.7999999999997, 1397.6999999999903, 0.7092198581560284, 1.5324331195244056, 0.3400083437630371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 144.9, 115, 349, 118.0, 328.70000000000005, 349.0, 349.0, 0.06266920685851801, 0.04853191507695778, 0.022276944625488817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82a56731-4e59-43a8-b03a-81ef3d16b4f5", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 164.7142857142857, 117, 459, 121.5, 399.0, 459.0, 459.0, 0.08888437412702847, 0.0721317528316022, 0.03159561736546715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e40b09ea-4b6a-4810-bdfa-1b513220d57e", 3, 0, 0.0, 537.0, 200, 1201, 210.0, 1201.0, 1201.0, 1201.0, 0.0382687229727144, 0.025051563117880423, 0.024540815187580525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cf34e03-76a0-4a7d-a504-d7dcc6b7b8e6", 1, 0, 0.0, 880.0, 880, 880, 880.0, 880.0, 880.0, 880.0, 1.1363636363636362, 0.20530007102272727, 0.7834694602272727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 275.90000000000003, 220, 461, 231.5, 460.5, 461.0, 461.0, 0.061248614250102584, 0.09492338946768829, 0.1377495689628772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f85340d-473b-431f-897d-4462c0d6b850", 3, 0, 0.0, 635.3333333333334, 211, 1202, 493.0, 1202.0, 1202.0, 1202.0, 0.03840393256269442, 0.024690028258893708, 0.024627521858238282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f892b215-6a7e-4e63-840b-818dea149ff8", 3, 0, 0.0, 640.3333333333334, 241, 1109, 571.0, 1109.0, 1109.0, 1109.0, 0.016818783217096855, 0.023186050431121475, 0.010785482727109635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 382.5714285714286, 227, 799, 441.5, 631.0, 799.0, 799.0, 0.07165083524402227, 0.11104480032447593, 0.16114440778025713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27186e15-40f3-4451-98d2-a505bab84daa", 3, 0, 0.0, 311.3333333333333, 226, 462, 246.0, 462.0, 462.0, 462.0, 0.02045533577433674, 0.024177514386919494, 0.013117516756329222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d8f5ba0-cf50-4df6-961a-50ac7bf25aa2", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 162.0625, 114, 344, 120.0, 341.2, 344.0, 344.0, 0.07609807138950322, 0.06309302989227367, 0.027050486314237475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 119.99999999999999, 111, 132, 119.0, 129.6, 132.0, 132.0, 0.09719562047968897, 0.07545949050913353, 0.03455000571738944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de697b47-0b6c-4f13-9c78-e60658dfd923", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 148.36842105263156, 110, 334, 115.0, 332.0, 334.0, 334.0, 0.0865765359360974, 0.06434057016344738, 0.04345736276479889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 173.57894736842107, 109, 352, 114.0, 347.0, 352.0, 352.0, 0.08657969204970585, 0.0231668316617377, 0.049377480622097875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 185.10526315789474, 108, 357, 114.0, 350.0, 357.0, 357.0, 0.08658166473756641, 0.0233364643237972, 0.05090054899610838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 147.57894736842104, 107, 336, 115.0, 334.0, 336.0, 336.0, 0.08658127019280282, 0.023336357981653885, 0.05098486906861338], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 40.0, 0.6134969325153374], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07668711656441718], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07668711656441718], "isController": false}, {"data": ["401/Unauthorized", 10, 50.0, 0.7668711656441718], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 20, "401/Unauthorized", 10, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

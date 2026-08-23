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

    var data = {"OkPercent": 98.25889477668433, "KoPercent": 1.7411052233156699};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8174083769633508, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3879310344827586, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e7b9997-a95b-4e33-8d11-c713d7b17fc6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99c35cdc-9f15-440f-a93e-651b943d3cbc"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/107bd8de-cff1-4e4d-9942-d3247cbbbdfa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecb9ed2d-af57-47e5-93fb-fc559caae1ba"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d78bde5-c760-49b3-b661-769d2dcfc069"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/99caca0b-b684-43de-b277-6c4f77c01b2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/5926f518-536f-4854-affd-d5072dcb994c"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=662f87d7-bc0b-4f70-8636-004aafc4eb79"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ef415a4-3ffb-4a03-9d82-7613c3ca3262"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3cd0919e-6b14-4423-94ad-7a8d07cb63a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecb9ed2d-af57-47e5-93fb-fc559caae1ba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=107bd8de-cff1-4e4d-9942-d3247cbbbdfa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4c068cfa-b1f5-4292-a037-fdb94b37a2c2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d78bde5-c760-49b3-b661-769d2dcfc069"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99c35cdc-9f15-440f-a93e-651b943d3cbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6057917-bbdb-4ac9-9daa-637f5a3fa3de"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/058110ab-a41a-43dc-aff7-d33d5f7464c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/662f87d7-bc0b-4f70-8636-004aafc4eb79"], "isController": false}, {"data": [0.325, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad1ee810-b171-4f44-8d94-3ab12749bd9c"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8362068965517241, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f3c0597-7f89-4dbc-bc30-ac83eb4d7439"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e7b9997-a95b-4e33-8d11-c713d7b17fc6"], "isController": false}, {"data": [0.901685393258427, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad1ee810-b171-4f44-8d94-3ab12749bd9c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f3c0597-7f89-4dbc-bc30-ac83eb4d7439"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/025d4de7-39a0-4087-a1a2-3d4d9929955f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cd0919e-6b14-4423-94ad-7a8d07cb63a7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99caca0b-b684-43de-b277-6c4f77c01b2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6057917-bbdb-4ac9-9daa-637f5a3fa3de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 23, 1.7411052233156699, 293.29220287660866, 77, 2367, 92.0, 850.5999999999999, 1035.299999999999, 1501.5999999999995, 5.183848055566457, 726.35899806366, 3.794161640848801], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1328.7241379310346, 939, 1984, 1284.0, 1610.6000000000001, 1691.9499999999996, 1984.0, 0.25429116338207247, 305.9980893910165, 1.2503476636999364], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2e7b9997-a95b-4e33-8d11-c713d7b17fc6", 3, 0, 0.0, 267.3333333333333, 194, 389, 219.0, 389.0, 389.0, 389.0, 0.03782815928176935, 0.024319861517413565, 0.024258292247749225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99c35cdc-9f15-440f-a93e-651b943d3cbc", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 581.5, 80, 1066, 480.5, 1028.2, 1066.0, 1066.0, 0.06342695857162489, 0.01206289080256245, 0.04285758764812838], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 581.5, 80, 1066, 480.5, 1028.2, 1066.0, 1066.0, 0.0642394847993319, 0.01221742154752919, 0.043406611514392325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 102.0, 77, 236, 80.0, 235.8, 236.0, 236.0, 0.12154395550333667, 0.03252250371866626, 0.0693180371229967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 89.9047619047619, 78, 237, 80.0, 102.60000000000001, 223.69999999999982, 237.0, 0.12154817648795226, 0.0903302366282536, 0.061011487026179166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 117.76190476190477, 78, 249, 80.0, 240.8, 248.2, 249.0, 0.12143641936043485, 0.032730909905742206, 0.07150992272884982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 101.66666666666667, 77, 235, 80.0, 234.8, 235.0, 235.0, 0.12144063287918391, 0.03273204558071754, 0.07139380956373897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/107bd8de-cff1-4e4d-9942-d3247cbbbdfa", 3, 0, 0.0, 417.0, 231, 614, 406.0, 614.0, 614.0, 614.0, 0.029157352512391876, 0.029242774443580522, 0.0186979116046263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecb9ed2d-af57-47e5-93fb-fc559caae1ba", 3, 0, 0.0, 525.0, 205, 1162, 208.0, 1162.0, 1162.0, 1162.0, 0.017734164868619395, 0.02444797793574321, 0.011372495049212308], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 234.5, 79, 416, 205.0, 413.0, 416.0, 416.0, 0.06301825954070192, 0.1273288857321409, 0.040735191693668245], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d78bde5-c760-49b3-b661-769d2dcfc069", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 90.875, 78, 237, 80.5, 132.0000000000001, 237.0, 237.0, 0.10716606050863692, 0.07964196488971943, 0.053792338966249395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 108.62500000000001, 78, 237, 80.0, 235.6, 237.0, 237.0, 0.10716749609843335, 0.038735712395930315, 0.0605564379198789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 587.5, 467, 643, 620.0, 643.0, 643.0, 643.0, 0.06037462454530361, 17.752144242524867, 0.03443240306099347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 851.0, 781, 932, 845.5, 932.0, 932.0, 932.0, 0.06002851354393337, 54.0137620057027, 0.03417639003526675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 119.5, 79, 237, 81.0, 237.0, 237.0, 237.0, 0.06073028163668109, 0.10746413117740834, 0.033627021179685725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99caca0b-b684-43de-b277-6c4f77c01b2b", 3, 0, 0.0, 743.3333333333334, 187, 1612, 431.0, 1612.0, 1612.0, 1612.0, 0.04257251518419708, 0.027370025224215246, 0.027300734021115967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 92.6923076923077, 78, 240, 80.0, 177.59999999999994, 240.0, 240.0, 0.06445343487228304, 0.047899476501765036, 0.03235260305112645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 105.23076923076923, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.06445503269853389, 0.01724675679628739, 0.036759510835882615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 117.0, 78, 237, 81.0, 236.2, 237.0, 237.0, 0.06445471312694603, 0.017372559397497173, 0.03789232158439601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 93.15384615384616, 77, 240, 80.0, 181.19999999999993, 240.0, 240.0, 0.06445439355852707, 0.01737247326382175, 0.03795507745682795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 81.5, 79, 85, 81.0, 85.0, 85.0, 85.0, 0.06072843760912141, 0.04513119240287245, 0.03410044104027814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 507.99999999999994, 79, 1003, 686.0, 939.0, 1003.0, 1003.0, 0.10498861702362797, 49.73390004738302, 0.05697316090334416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 132.5625, 78, 775, 79.5, 396.3000000000004, 775.0, 775.0, 0.10716893172669244, 6.054004612031722, 0.06242799587399613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 379.0526315789474, 78, 697, 617.0, 628.0, 697.0, 697.0, 0.10498861702362797, 16.260845945781668, 0.057075688849656296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 142.25, 78, 621, 80.5, 348.7000000000003, 621.0, 621.0, 0.10716821390775495, 1.9965181842690458, 0.06253223418933944], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 629.3333333333334, 192, 1077, 507.0, 1047.0, 1077.0, 1077.0, 0.06431591979804802, 0.0122319583795604, 0.04396072675649457], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 223.2307692307692, 159, 480, 164.0, 415.5999999999999, 480.0, 480.0, 0.06442788042185393, 0.0998506310834787, 0.14489981309719688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5926f518-536f-4854-affd-d5072dcb994c", 1, 0, 0.0, 1522.0, 1522, 1522, 1522.0, 1522.0, 1522.0, 1522.0, 0.657030223390276, 0.2098133623521682, 0.39203658837056504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 471.25000000000006, 91, 1458, 408.0, 961.6000000000004, 1434.0499999999997, 1458.0, 0.09241332785014256, 0.05676560861107389, 0.04178454179161718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 80.89473684210526, 78, 87, 81.0, 82.0, 87.0, 87.0, 0.10498803688948075, 0.07802333600868637, 0.05269907320429014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 122.42105263157896, 78, 252, 80.0, 239.0, 252.0, 252.0, 0.10498803688948075, 0.11108571789714487, 0.05523527680924779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=662f87d7-bc0b-4f70-8636-004aafc4eb79", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 0.9409586588541666, 3.590901692708333], "isController": false}, {"data": ["login", 20, 0, 0.0, 2465.2999999999997, 1486, 3903, 2161.0, 3798.600000000001, 3899.45, 3903.0, 0.08831854733653341, 21.254462156606447, 0.16254407647503014], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6ef415a4-3ffb-4a03-9d82-7613c3ca3262", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 84.1875, 80, 94, 83.0, 90.5, 94.0, 94.0, 0.1066069667652781, 0.08630583539884332, 0.037895445217344954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 590.1052631578948, 160, 1085, 765.0, 1020.0, 1085.0, 1085.0, 0.10494106730588663, 66.15388118841616, 0.22188325893103714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cd0919e-6b14-4423-94ad-7a8d07cb63a7", 3, 0, 0.0, 298.0, 195, 404, 295.0, 404.0, 404.0, 404.0, 0.02911179901213962, 0.024269309007190615, 0.018668699236300473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 223.66666666666666, 159, 473, 162.0, 342.0, 460.1999999999998, 473.0, 0.12137886389383395, 0.18811353222608837, 0.2729839097143551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 648.3333333333333, 78, 1014, 895.0, 1014.0, 1014.0, 1014.0, 0.04451269724688968, 35.50574422447753, 0.07674528026307004], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1079.7142857142858, 248, 1647, 1094.0, 1521.2, 1634.7999999999997, 1647.0, 0.08900681114026202, 0.028261649296210428, 0.0401573698699229], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecb9ed2d-af57-47e5-93fb-fc559caae1ba", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=107bd8de-cff1-4e4d-9942-d3247cbbbdfa", 1, 0, 0.0, 977.0, 977, 977, 977.0, 977.0, 977.0, 977.0, 1.0235414534288638, 0.18491715711361312, 0.7056838536335722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 93.13333333333334, 80, 236, 82.0, 151.40000000000003, 236.0, 236.0, 0.07425779335541265, 0.05765131417729791, 0.026396324981806843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 272.875, 159, 1012, 166.5, 527.6000000000005, 1012.0, 1012.0, 0.10710795142654403, 8.164268295795344, 0.2391755072565637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c068cfa-b1f5-4292-a037-fdb94b37a2c2", 1, 0, 0.0, 1066.0, 1066, 1066, 1066.0, 1066.0, 1066.0, 1066.0, 0.9380863039399625, 0.29956466932457787, 0.5597370426829268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 317.31250000000006, 160, 1006, 241.0, 905.9000000000001, 1006.0, 1006.0, 0.07538742066651903, 11.375926808826925, 0.1671370036798485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d78bde5-c760-49b3-b661-769d2dcfc069", 3, 0, 0.0, 355.3333333333333, 236, 503, 327.0, 503.0, 503.0, 503.0, 0.017120160701241782, 0.02360152362296841, 0.010978748887189554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 81.74999999999999, 79, 90, 81.0, 90.0, 90.0, 90.0, 0.04030795275907937, 0.029955421923495505, 0.020232702849772258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 99.0, 78, 236, 79.0, 236.0, 236.0, 236.0, 0.04030835894593641, 0.010785635108580643, 0.02298836096135436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 80.0, 78, 82, 79.5, 82.0, 82.0, 82.0, 0.04030795275907937, 0.01086425289209561, 0.023696667540005642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 138.125, 79, 234, 83.0, 234.0, 234.0, 234.0, 0.04027771484384834, 0.010856102829005995, 0.02371822465902397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.2339827405857742, 2.5864605125523012], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 928.948275862069, 618, 1635, 859.5, 1262.1, 1337.95, 1635.0, 0.25237142111217475, 301.923958152032, 0.4983349741101732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1079.7142857142858, 248, 1647, 1094.0, 1521.2, 1634.7999999999997, 1647.0, 0.08993845639912118, 0.02855746746155131, 0.04057770200819725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 112.1, 78, 236, 80.5, 235.7, 236.0, 236.0, 0.06830787726440614, 0.018411107543921966, 0.04022426756878603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99c35cdc-9f15-440f-a93e-651b943d3cbc", 3, 0, 0.0, 288.0, 205, 442, 217.0, 442.0, 442.0, 442.0, 0.027671702916597485, 0.027752772358735956, 0.01774520011253159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 81.80000000000001, 77, 94, 79.5, 93.7, 94.0, 94.0, 0.06838167918051397, 0.018430999466622904, 0.04020094811198184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 204.73333333333332, 78, 933, 80.0, 932.4, 933.0, 933.0, 0.07131650263871059, 8.57275434733514, 0.041109135049683825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 188.2, 78, 614, 82.0, 568.4, 614.0, 614.0, 0.07126330842284796, 2.810483842232537, 0.04114806526056241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 80.93333333333334, 79, 89, 80.0, 86.0, 89.0, 89.0, 0.07131514638622381, 0.052998853906168285, 0.0357968605883975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 111.2, 77, 235, 80.5, 234.9, 235.0, 235.0, 0.06830834386420302, 0.018277818573038694, 0.03895710236005328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 121.39999999999999, 77, 245, 79.0, 240.2, 245.0, 245.0, 0.0712622927454986, 0.03333924711387714, 0.03984378711577747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 80.10000000000001, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.06838027639307719, 0.05081776399915208, 0.03432369342386882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 93.89999999999999, 80, 153, 85.5, 148.60000000000002, 153.0, 153.0, 0.0671492459139684, 0.05285380098306496, 0.02386945850848095], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 528.8333333333334, 78, 1162, 433.5, 1133.5, 1162.0, 1162.0, 0.06285091762339731, 0.01181012115823766, 0.04277524610062432], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6057917-bbdb-4ac9-9daa-637f5a3fa3de", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1442.95, 955, 2367, 1369.0, 2040.6000000000004, 2351.5, 2367.0, 0.09035831590170823, 0.046767487722563825, 0.04156129569307087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 193.60000000000002, 160, 317, 162.5, 316.7, 317.0, 317.0, 0.06826963776130204, 0.1058046046163929, 0.1535400153948033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/058110ab-a41a-43dc-aff7-d33d5f7464c9", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/662f87d7-bc0b-4f70-8636-004aafc4eb79", 3, 0, 0.0, 303.0, 209, 431, 269.0, 431.0, 431.0, 431.0, 0.08949880668257756, 0.040495879325775655, 0.05739344048329355], "isController": false}, {"data": ["addBook", 60, 15, 25.0, 850.65, 405, 1975, 692.0, 1500.1, 1605.0, 1975.0, 0.2853229856197215, 86.43013261128785, 1.0370032333632921], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ad1ee810-b171-4f44-8d94-3ab12749bd9c", 3, 0, 0.0, 299.6666666666667, 199, 389, 311.0, 389.0, 389.0, 389.0, 0.028865027133125505, 0.024063585445291153, 0.018510450342531654], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 150.82758620689654, 78, 573, 82.0, 319.2, 322.15, 573.0, 0.2532286654849329, 0.18819044378323627, 0.12241034122562675], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 496.60344827586204, 385, 717, 467.0, 642.3000000000001, 706.55, 717.0, 0.2534743466480203, 74.52987405493401, 0.12747977394895552], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 118.94827586206898, 78, 337, 83.5, 236.1, 237.05, 337.0, 0.25380599594785597, 0.4491176412671046, 0.12343299412307841], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 775.258620689655, 536, 1090, 770.5, 1018.7, 1029.35, 1090.0, 0.253040853009441, 227.68660433626948, 0.1270146469207546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 112.875, 80, 289, 88.0, 251.20000000000005, 289.0, 289.0, 0.07753778755615433, 0.05792617918013482, 0.02756226042035173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f3c0597-7f89-4dbc-bc30-ac83eb4d7439", 1, 0, 0.0, 966.0, 966, 966, 966.0, 966.0, 966.0, 966.0, 1.0351966873706004, 0.18702283902691513, 0.7137195910973085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e7b9997-a95b-4e33-8d11-c713d7b17fc6", 1, 0, 0.0, 798.0, 798, 798, 798.0, 798.0, 798.0, 798.0, 1.2531328320802004, 0.22639606829573933, 0.8639763471177945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 15, 8.426966292134832, 147.2696629213483, 79, 1653, 85.0, 274.79999999999995, 384.5999999999998, 807.7000000000085, 0.7199016404050863, 1.5473667095035106, 0.34472510904689874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 84.625, 81, 97, 81.0, 97.0, 97.0, 97.0, 0.03901544523938415, 0.03021410944807776, 0.013868771549937332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad1ee810-b171-4f44-8d94-3ab12749bd9c", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f3c0597-7f89-4dbc-bc30-ac83eb4d7439", 3, 0, 0.0, 558.6666666666666, 193, 1067, 416.0, 1067.0, 1067.0, 1067.0, 0.040703906218200074, 0.03353567273381002, 0.026102439859978562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/025d4de7-39a0-4087-a1a2-3d4d9929955f", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 98.9047619047619, 80, 345, 83.0, 111.2, 321.79999999999967, 345.0, 0.11667768622592134, 0.09468667700560608, 0.04147527127562047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cd0919e-6b14-4423-94ad-7a8d07cb63a7", 1, 0, 0.0, 946.0, 946, 946, 946.0, 946.0, 946.0, 946.0, 1.0570824524312896, 0.1909768102536998, 0.7288088002114165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99caca0b-b684-43de-b277-6c4f77c01b2b", 1, 0, 0.0, 1077.0, 1077, 1077, 1077.0, 1077.0, 1077.0, 1077.0, 0.9285051067780873, 0.16774750464252555, 0.640160747446611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 221.37500000000003, 161, 318, 170.5, 318.0, 318.0, 318.0, 0.04026068795450542, 0.062396202913867285, 0.09054723081955662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 319.53333333333336, 159, 1017, 172.0, 1014.6, 1017.0, 1017.0, 0.07123488039663582, 11.458571092113823, 0.15777876731601218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6057917-bbdb-4ac9-9daa-637f5a3fa3de", 3, 0, 0.0, 289.6666666666667, 210, 436, 223.0, 436.0, 436.0, 436.0, 0.04020800943547955, 0.033519763074304404, 0.025784433134080312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 96.0, 79, 241, 83.0, 181.79999999999995, 241.0, 241.0, 0.06608276612292412, 0.054789324646838444, 0.02349035827025818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 93.0, 79, 250, 84.0, 92.0, 250.0, 250.0, 0.1028016145264092, 0.07981180034032745, 0.03654276141368452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 81.625, 78, 90, 81.0, 87.9, 90.0, 90.0, 0.07541584769769558, 0.05604634775190071, 0.03785522042638235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 138.74999999999997, 78, 256, 80.0, 244.8, 256.0, 256.0, 0.07541869157997445, 0.03433980952066708, 0.04222047358224644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 204.9375, 77, 926, 80.0, 821.0000000000001, 926.0, 926.0, 0.07541869157997445, 8.500520639385526, 0.04352778000367666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 166.56250000000003, 79, 467, 80.0, 462.8, 467.0, 467.0, 0.07541869157997445, 2.789736665032595, 0.04360143106967273], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 17.391304347826086, 0.3028009084027252], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.3478260869565215, 0.0757002271006813], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.0757002271006813], "isController": false}, {"data": ["401/Unauthorized", 17, 73.91304347826087, 1.2869038607115821], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 23, "401/Unauthorized", 17, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

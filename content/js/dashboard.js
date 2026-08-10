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

    var data = {"OkPercent": 99.11958914159942, "KoPercent": 0.880410858400587};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7647245091830273, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.04918032786885246, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3c482d6-b567-4485-bbdc-0b42f9f86fb4"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2bf5711-54f3-45d1-92a0-675e43ac588b"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/29950ed2-c6b1-4197-a58b-ba2719769fae"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=560780e9-5985-469b-aa2e-ccc59dcbe25c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f673b2a-03da-4b59-84fa-2a2dc2fc88d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f487126-9fb6-48d3-b17a-9002627682d4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10c4fa12-a42a-45c2-a7b8-51cda44b4dd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/638f59ca-45e7-4f44-960e-67d14aead638"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6367601-6339-42cc-9e27-fe4e38e9d23a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de1fa3a5-9f41-46e0-9031-a72407243ff1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a51eff3d-60e5-4d49-b2f3-406aef8c4ae1"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/209a43a8-8bb7-424b-a93e-ce1c46280d54"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/080629af-17b2-48c9-8f05-c5baf1864e33"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51b95a5d-cb0b-4131-a3ab-3d5b8feea504"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/004abebc-30e0-4c31-bdba-e039cf96a075"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=080629af-17b2-48c9-8f05-c5baf1864e33"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2bf5711-54f3-45d1-92a0-675e43ac588b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4016393442622951, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3c482d6-b567-4485-bbdc-0b42f9f86fb4"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.025, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6367601-6339-42cc-9e27-fe4e38e9d23a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de1fa3a5-9f41-46e0-9031-a72407243ff1"], "isController": false}, {"data": [0.325, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10c4fa12-a42a-45c2-a7b8-51cda44b4dd7"], "isController": false}, {"data": [0.9918032786885246, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a51eff3d-60e5-4d49-b2f3-406aef8c4ae1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=638f59ca-45e7-4f44-960e-67d14aead638"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f673b2a-03da-4b59-84fa-2a2dc2fc88d3"], "isController": false}, {"data": [0.4918032786885246, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9419889502762431, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/560780e9-5985-469b-aa2e-ccc59dcbe25c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36f4ec42-a77d-41f3-8239-bce11989b59f"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=209a43a8-8bb7-424b-a93e-ce1c46280d54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=004abebc-30e0-4c31-bdba-e039cf96a075"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/51b95a5d-cb0b-4131-a3ab-3d5b8feea504"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1363, 12, 0.880410858400587, 410.13793103448216, 101, 3715, 133.0, 1075.6000000000001, 1353.0, 2091.08, 5.324281143919655, 751.2028339199287, 3.9000891917190432], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 61, 0, 0.0, 1801.1311475409834, 1252, 2813, 1751.0, 2202.2000000000003, 2374.4, 2813.0, 0.26497660821253727, 318.855828596243, 1.3028879124512942], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d3c482d6-b567-4485-bbdc-0b42f9f86fb4", 3, 0, 0.0, 342.6666666666667, 221, 555, 252.0, 555.0, 555.0, 555.0, 0.027528744597483872, 0.02778861881406168, 0.017653524367527092], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 809.076923076923, 518, 1300, 697.0, 1276.8, 1300.0, 1300.0, 0.07953697245573461, 0.014369472562803617, 0.05406028596600712], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 809.076923076923, 518, 1300, 697.0, 1276.8, 1300.0, 1300.0, 0.07811420296473445, 0.014112429246558469, 0.05309324732759294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 164.3846153846154, 107, 339, 114.0, 339.0, 339.0, 339.0, 0.13102989497449957, 0.06533777365089605, 0.07303499254137522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 112.30769230769229, 109, 115, 114.0, 114.6, 115.0, 115.0, 0.13104442405975625, 0.0973875065522212, 0.06577815817061984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2bf5711-54f3-45d1-92a0-675e43ac588b", 3, 0, 0.0, 475.66666666666663, 216, 885, 326.0, 885.0, 885.0, 885.0, 0.021437146287086265, 0.021499950426599215, 0.013747128315611961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 306.69230769230774, 108, 913, 130.0, 905.0, 913.0, 913.0, 0.13102593305582713, 5.956955461261679, 0.07542455866938126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 332.00000000000006, 106, 1237, 133.0, 1117.8, 1237.0, 1237.0, 0.13102197137673857, 18.16738922974199, 0.07529432700060472], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 334.07692307692304, 216, 619, 284.0, 553.0, 619.0, 619.0, 0.08058567186754195, 0.19909116409102462, 0.05209737771124295], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/29950ed2-c6b1-4197-a58b-ba2719769fae", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.49896240234375, 0.93231201171875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=560780e9-5985-469b-aa2e-ccc59dcbe25c", 1, 0, 0.0, 1207.0, 1207, 1207, 1207.0, 1207.0, 1207.0, 1207.0, 0.828500414250207, 0.1496802506213753, 0.5712121996685998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 115.06666666666668, 108, 135, 114.0, 124.2, 135.0, 135.0, 0.13814571610134369, 0.10266493159484624, 0.06934267390243229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 136.6, 107, 453, 114.0, 254.40000000000012, 453.0, 453.0, 0.1381800762754021, 0.05080996554710098, 0.07803216026125247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 748.75, 654, 907, 717.0, 907.0, 907.0, 907.0, 0.07868749262304757, 23.136735501829484, 0.044876460636581815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1131.5, 977, 1207, 1171.0, 1207.0, 1207.0, 1207.0, 0.0778406990094771, 70.04119779808123, 0.04431750734621597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 283.25, 113, 345, 337.5, 345.0, 345.0, 345.0, 0.07916872835230085, 0.14009153884215736, 0.04383659079663533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 114.58823529411764, 105, 125, 115.0, 123.4, 125.0, 125.0, 0.07568506110455668, 0.05624641748102308, 0.03799035293724818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f673b2a-03da-4b59-84fa-2a2dc2fc88d3", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 126.76470588235294, 106, 342, 114.0, 163.59999999999985, 342.0, 342.0, 0.07568809381761842, 0.02693953523058155, 0.04279194734334791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 228.47058823529412, 104, 1208, 115.0, 520.7999999999994, 1208.0, 1208.0, 0.07568741986037898, 4.025298554871153, 0.044113313528458466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 237.58823529411765, 109, 885, 116.0, 455.39999999999964, 885.0, 885.0, 0.07568843080073907, 1.3283128297455533, 0.04418781722357027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f487126-9fb6-48d3-b17a-9002627682d4", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.6882240032327586, 1.2859476023706895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10c4fa12-a42a-45c2-a7b8-51cda44b4dd7", 1, 0, 0.0, 3220.0, 3220, 3220, 3220.0, 3220.0, 3220.0, 3220.0, 0.31055900621118016, 0.05610685170807453, 0.21411587732919254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 112.0, 109, 115, 112.0, 115.0, 115.0, 115.0, 0.07953867568104991, 0.05911028534499901, 0.0446628305826208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 735.25, 108, 1462, 657.0, 1383.1000000000001, 1458.2, 1462.0, 0.11348934335065937, 51.07424978224232, 0.061842825771160084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 185.8, 103, 787, 114.0, 510.4000000000002, 787.0, 787.0, 0.13818771419095702, 8.324199389325459, 0.08044756121715739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 502.7500000000001, 106, 993, 554.5, 909.4, 988.8499999999999, 993.0, 0.11348483558884444, 16.699448711947113, 0.06195119442789457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 165.73333333333335, 106, 680, 114.0, 476.0000000000001, 680.0, 680.0, 0.13817753049117507, 2.743345744362357, 0.0805765716542614], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 872.6923076923077, 279, 3220, 655.0, 2414.7999999999993, 3220.0, 3220.0, 0.07810716302767397, 0.01411115738292938, 0.05385122763431428], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/638f59ca-45e7-4f44-960e-67d14aead638", 3, 0, 0.0, 857.0, 279, 1776, 516.0, 1776.0, 1776.0, 1776.0, 0.0473186119873817, 0.030421308162460567, 0.030344292192429023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 374.47058823529414, 220, 1323, 240.0, 635.7999999999994, 1323.0, 1323.0, 0.07564633115293909, 5.433829623325769, 0.16899185272326792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6367601-6339-42cc-9e27-fe4e38e9d23a", 1, 0, 0.0, 967.0, 967, 967, 967.0, 967.0, 967.0, 967.0, 1.0341261633919339, 0.18682943381592554, 0.7129815149948294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de1fa3a5-9f41-46e0-9031-a72407243ff1", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.2712673611111111, 1.0352149024024024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a51eff3d-60e5-4d49-b2f3-406aef8c4ae1", 3, 0, 0.0, 1062.3333333333333, 254, 2287, 646.0, 2287.0, 2287.0, 2287.0, 0.06148800983808158, 0.039530865699938515, 0.03943078755892601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 723.5000000000001, 121, 1565, 604.5, 1418.1000000000001, 1557.75, 1565.0, 0.0859361236792692, 0.05278693534595735, 0.03885588404638832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 128.45, 108, 346, 115.0, 169.5000000000001, 337.4499999999999, 346.0, 0.11362797066125797, 0.08444422429025128, 0.05703591496082676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 215.74999999999997, 103, 351, 115.0, 347.6, 350.85, 351.0, 0.1136305529830861, 0.11573893238413946, 0.06003332926157186], "isController": false}, {"data": ["login", 20, 0, 0.0, 3589.3, 2134, 5906, 3368.5, 5071.400000000001, 5865.199999999999, 5906.0, 0.08501088139281829, 20.45844973625374, 0.15645654987588412], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 141.86666666666667, 113, 333, 118.0, 279.6, 333.0, 333.0, 0.1422245820967696, 0.11514079937326367, 0.05055639441721107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/209a43a8-8bb7-424b-a93e-ce1c46280d54", 3, 0, 0.0, 361.0, 284, 512, 287.0, 512.0, 512.0, 512.0, 0.06847595352765287, 0.030983585743306476, 0.04391198842756385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 872.7499999999998, 228, 1639, 885.0, 1498.9, 1632.1499999999999, 1639.0, 0.1134095445472691, 67.92650272962598, 0.24055227612955907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/080629af-17b2-48c9-8f05-c5baf1864e33", 3, 0, 0.0, 408.6666666666667, 258, 537, 431.0, 537.0, 537.0, 537.0, 0.03151690882158278, 0.0256177478279597, 0.020211038534673854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 501.3846153846154, 224, 1352, 453.0, 1232.8, 1352.0, 1352.0, 0.13086896996053796, 24.258508134639005, 0.28917598793488763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1244.25, 1087, 1317, 1286.5, 1317.0, 1317.0, 1317.0, 0.07767442763656135, 92.9256194535604, 0.1751467318484572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51b95a5d-cb0b-4131-a3ab-3d5b8feea504", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1404.739130434783, 197, 2382, 1480.0, 2214.2000000000003, 2364.6, 2382.0, 0.09113278046113188, 0.028571860178541006, 0.04111654743461223], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/004abebc-30e0-4c31-bdba-e039cf96a075", 3, 0, 0.0, 626.0, 264, 1068, 546.0, 1068.0, 1068.0, 1068.0, 0.021918128484069176, 0.025906485848195045, 0.014055570675005298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 122.0, 108, 148, 120.0, 140.00000000000003, 147.65, 148.0, 0.08922357643783793, 0.0692702570977355, 0.0317161931868877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 319.3333333333333, 224, 902, 230.0, 630.2000000000002, 902.0, 902.0, 0.13800082800496802, 11.206080517733108, 0.30801317620405727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=080629af-17b2-48c9-8f05-c5baf1864e33", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 337.07142857142867, 228, 575, 245.0, 515.5, 575.0, 575.0, 0.15654526953740874, 0.242614592535027, 0.352073980219387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 131.9230769230769, 101, 341, 115.0, 261.3999999999999, 341.0, 341.0, 0.08242350464741761, 0.0612541865592625, 0.04137273573122329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 146.92307692307693, 106, 342, 114.0, 341.2, 342.0, 342.0, 0.0824203692432542, 0.02205388786391763, 0.04700536683404341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2bf5711-54f3-45d1-92a0-675e43ac588b", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 143.15384615384616, 101, 332, 109.0, 328.0, 332.0, 332.0, 0.08242716292045779, 0.02221669625590464, 0.04845815632628475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 147.0769230769231, 104, 340, 114.0, 339.2, 340.0, 340.0, 0.0824203692432542, 0.02221486514759586, 0.04853465102898661], "isController": false}, {"data": ["https://demoqa.com/books", 61, 0, 0.0, 1217.1803278688524, 818, 2161, 1118.0, 1731.8000000000002, 1900.6, 2161.0, 0.2589474846011148, 309.7912162943766, 0.5113201307260293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1404.739130434783, 197, 2382, 1480.0, 2214.2000000000003, 2364.6, 2382.0, 0.09156451914693717, 0.02870721846896162, 0.04131133578699704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 190.22222222222223, 114, 347, 115.0, 347.0, 347.0, 347.0, 0.04123843605522285, 0.011115047218009284, 0.024283961856737674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 139.88888888888889, 106, 339, 114.0, 339.0, 339.0, 339.0, 0.04123597976687926, 0.011114385171541676, 0.024242245917638003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3c482d6-b567-4485-bbdc-0b42f9f86fb4", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 230.45000000000002, 109, 1192, 115.0, 447.90000000000026, 1155.3999999999996, 1192.0, 0.09248512145608576, 4.184594991757264, 0.053973738849762545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 184.0, 102, 897, 115.0, 338.6, 869.1499999999996, 897.0, 0.09248512145608576, 1.3833660740297153, 0.054064056351184504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 125.75, 107, 346, 115.0, 117.0, 334.54999999999984, 346.0, 0.09248469378317889, 0.06873130075097571, 0.04642298105913471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 162.33333333333334, 104, 342, 114.0, 342.0, 342.0, 342.0, 0.04123843605522285, 0.011034503397588926, 0.02351879556274428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 136.05, 108, 340, 113.5, 306.0000000000004, 339.25, 340.0, 0.09248597681376561, 0.031692704359326515, 0.05235753980365227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 160.44444444444443, 107, 340, 114.0, 340.0, 340.0, 340.0, 0.04123900293255132, 0.030647344952804252, 0.020700046393878298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 124.22222222222223, 114, 144, 119.0, 144.0, 144.0, 144.0, 0.041745712947200954, 0.032858442026800744, 0.014839296399200338], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 653.8461538461539, 458, 1017, 614.0, 964.1999999999999, 1017.0, 1017.0, 0.07729123933529534, 0.013963749293974257, 0.05260936896162193], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2050.2999999999997, 1478, 3715, 1915.0, 2799.5000000000005, 3670.6999999999994, 3715.0, 0.08553478485863239, 0.04427093356940934, 0.03934265983243736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 353.4444444444444, 224, 680, 231.0, 680.0, 680.0, 680.0, 0.04121464127234177, 0.06387464423750625, 0.09269269418965147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6367601-6339-42cc-9e27-fe4e38e9d23a", 3, 0, 0.0, 485.66666666666663, 243, 760, 454.0, 760.0, 760.0, 760.0, 0.018121522932787272, 0.02498198229829235, 0.011620898495309546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de1fa3a5-9f41-46e0-9031-a72407243ff1", 3, 0, 0.0, 374.0, 232, 614, 276.0, 614.0, 614.0, 614.0, 0.026682557612088976, 0.02676072916759314, 0.017110884927023205], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 1219.7499999999998, 563, 2738, 1022.5, 2125.7, 2298.6499999999996, 2738.0, 0.28398333964407424, 86.00240387459769, 1.0340432423797803], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/10c4fa12-a42a-45c2-a7b8-51cda44b4dd7", 3, 0, 0.0, 502.3333333333333, 350, 699, 458.0, 699.0, 699.0, 699.0, 0.01914351896165553, 0.02262699132479532, 0.012276280063301235], "isController": false}, {"data": ["https://demoqa.com/books-0", 61, 0, 0.0, 194.7704918032787, 103, 653, 115.0, 456.8, 462.7, 653.0, 0.25972367104506844, 0.19301729850126667, 0.12555001676495006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a51eff3d-60e5-4d49-b2f3-406aef8c4ae1", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=638f59ca-45e7-4f44-960e-67d14aead638", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/books-3", 61, 0, 0.0, 705.0819672131147, 504, 1045, 671.0, 923.0, 1009.6999999999999, 1045.0, 0.25984537070562924, 76.40316666577922, 0.1306839510873038], "isController": false}, {"data": ["https://demoqa.com/books-1", 61, 0, 0.0, 177.90163934426235, 104, 469, 119.0, 347.6, 415.5, 469.0, 0.26034108950612017, 0.46068169354012667, 0.12661119391996858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f673b2a-03da-4b59-84fa-2a2dc2fc88d3", 3, 0, 0.0, 457.0, 293, 664, 414.0, 664.0, 664.0, 664.0, 0.01716659609288273, 0.02366553855903592, 0.011008526791334301], "isController": false}, {"data": ["https://demoqa.com/books-2", 61, 0, 0.0, 1014.9836065573771, 703, 1590, 1002.0, 1339.2, 1456.1999999999998, 1590.0, 0.25969823916079154, 233.67693209769124, 0.13035634270375668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 137.49999999999997, 111, 353, 120.5, 242.0, 353.0, 353.0, 0.14600214831732525, 0.10907387056909552, 0.05189920115967421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 5, 2.7624309392265194, 210.16574585635365, 103, 1075, 125.0, 376.60000000000014, 534.6000000000001, 999.5600000000006, 0.7320407354380516, 1.5850705714063271, 0.35045881461978373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 154.0, 116, 352, 121.0, 340.8, 352.0, 352.0, 0.08068269976726145, 0.062481817300232737, 0.028680178432893715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 121.3076923076923, 116, 134, 120.0, 131.6, 134.0, 134.0, 0.13191273465246067, 0.10705027587519027, 0.04689085489599188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 298.9230769230769, 215, 680, 230.0, 594.3999999999999, 680.0, 680.0, 0.08236397273118934, 0.1276480710199194, 0.1852385050780557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/560780e9-5985-469b-aa2e-ccc59dcbe25c", 3, 0, 0.0, 1036.0, 619, 1472, 1017.0, 1472.0, 1472.0, 1472.0, 0.023999040038398464, 0.02406934972601096, 0.015390009399624016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36f4ec42-a77d-41f3-8239-bce11989b59f", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 0.973585175304878, 1.8191453887195121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 399.49999999999994, 224, 1306, 332.5, 675.1000000000003, 1275.0499999999997, 1306.0, 0.09243511055239223, 5.665319942470698, 0.20670621059953412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=209a43a8-8bb7-424b-a93e-ce1c46280d54", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 0.6475414426523297, 2.4711581541218637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 121.6470588235294, 111, 144, 119.0, 132.0, 144.0, 144.0, 0.07680769161260008, 0.06368137712802487, 0.027302734127916433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 130.14999999999998, 104, 340, 119.0, 135.70000000000002, 329.84999999999985, 340.0, 0.11071622324819255, 0.08595644285382137, 0.03935615748275595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=004abebc-30e0-4c31-bdba-e039cf96a075", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51b95a5d-cb0b-4131-a3ab-3d5b8feea504", 3, 0, 0.0, 593.0, 415, 790, 574.0, 790.0, 790.0, 790.0, 0.019774178877222125, 0.023372409994529143, 0.012680707157593615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 114.92857142857142, 111, 118, 115.0, 118.0, 118.0, 118.0, 0.15674507652518557, 0.1164873078473303, 0.07867868099018105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 146.07142857142856, 104, 338, 113.5, 333.5, 338.0, 338.0, 0.15674858646363993, 0.041942492862341155, 0.08939567821754464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 163.28571428571433, 106, 342, 113.5, 342.0, 342.0, 342.0, 0.15675736199753668, 0.04225100772589856, 0.09215618351808308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 217.64285714285714, 111, 458, 116.5, 400.0, 458.0, 458.0, 0.15674507652518557, 0.04224769640717893, 0.0923020323678583], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 58.333333333333336, 0.5135730007336757], "isController": false}, {"data": ["401/Unauthorized", 5, 41.666666666666664, 0.36683785766691124], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1363, 12, "406/Not Acceptable", 7, "401/Unauthorized", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

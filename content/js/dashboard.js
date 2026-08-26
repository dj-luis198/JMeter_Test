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

    var data = {"OkPercent": 98.31288343558282, "KoPercent": 1.687116564417178};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7723362011912641, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05357142857142857, 500, 1500, "see books"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fef85424-c481-45cc-a235-be3e55a9af54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c13f320c-37c9-4a7e-b7f6-de96fb5c4c0d"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea253f20-4b03-4e5d-b09c-47667bd072fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae0ad530-31fc-4865-a683-c3b923a0de34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8af321f5-32aa-4a08-8c5a-dd216a7db354"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1e8189c-4be1-4652-b3b2-b6a08e901d45"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/79d727a7-81e9-4a5c-8c49-8bf94ba66ca3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b8406b2-b733-40db-bd1c-31c82409efa7"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70d1dd89-b2f5-48e1-9c04-1fd4be833e81"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a4ac1ef7-9652-4755-85ce-8e62dca35ba6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c772223-7fba-489f-afb4-46eaec91dcae"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae0ad530-31fc-4865-a683-c3b923a0de34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea253f20-4b03-4e5d-b09c-47667bd072fe"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e32df0aa-a78f-445f-b3e4-9f3e0576b4c7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/37f0a456-8549-4a04-bf9a-520d5d6f5f11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/140f23ae-ba28-4889-b5d8-7ddb91df06e3"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e32df0aa-a78f-445f-b3e4-9f3e0576b4c7"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fef85424-c481-45cc-a235-be3e55a9af54"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8af321f5-32aa-4a08-8c5a-dd216a7db354"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79d727a7-81e9-4a5c-8c49-8bf94ba66ca3"], "isController": false}, {"data": [0.2966101694915254, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e4cc1d92-2957-4328-af95-be74e76d6fa5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4ac1ef7-9652-4755-85ce-8e62dca35ba6"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9252873563218391, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70d1dd89-b2f5-48e1-9c04-1fd4be833e81"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4cc1d92-2957-4328-af95-be74e76d6fa5"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da6aa228-8d3d-4da9-8ec7-2cb4259cfae7"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c13f320c-37c9-4a7e-b7f6-de96fb5c4c0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=140f23ae-ba28-4889-b5d8-7ddb91df06e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 22, 1.687116564417178, 396.52990797546033, 0, 2722, 130.5, 1104.0, 1361.75, 1788.7000000000012, 5.12735823090413, 727.7846987529589, 3.7464386007207398], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 1, 1.7857142857142858, 1857.9464285714287, 1340, 2880, 1815.5, 2304.2000000000003, 2417.5, 2880.0, 0.24616791289172568, 296.230573580853, 1.2078171293854154], "isController": true}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 538.75, 112, 885, 495.0, 859.2, 885.0, 885.0, 0.08039123735512829, 0.015289251440343002, 0.05432034861325115], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 538.75, 112, 885, 495.0, 859.2, 885.0, 885.0, 0.079805275128686, 0.015177809893858982, 0.05392441401314126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 128.57142857142856, 108, 345, 112.5, 229.5, 345.0, 345.0, 0.08023290466038557, 0.021468570192329735, 0.04575782843912615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 115.71428571428571, 109, 130, 115.5, 126.0, 130.0, 130.0, 0.0802315252586034, 0.059625186251755065, 0.040272464827072404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 162.5, 111, 346, 115.0, 344.5, 346.0, 346.0, 0.08023106546854941, 0.02162477936456996, 0.047245441872593066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fef85424-c481-45cc-a235-be3e55a9af54", 3, 0, 0.0, 398.0, 260, 616, 318.0, 616.0, 616.0, 616.0, 0.03421649919591227, 0.02819074201329881, 0.0219422211640453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 161.85714285714283, 109, 348, 113.0, 344.5, 348.0, 348.0, 0.08023198505392735, 0.021625027221566357, 0.047167631838344014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c13f320c-37c9-4a7e-b7f6-de96fb5c4c0d", 3, 0, 0.0, 338.0, 234, 461, 319.0, 461.0, 461.0, 461.0, 0.02093013520867345, 0.024738711244366305, 0.013421994258166241], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 245.16666666666666, 111, 370, 224.5, 368.5, 370.0, 370.0, 0.08127273096694232, 0.16718187017019864, 0.052534936691928935], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ea253f20-4b03-4e5d-b09c-47667bd072fe", 3, 0, 0.0, 345.0, 201, 493, 341.0, 493.0, 493.0, 493.0, 0.019244956217724603, 0.02653072577541136, 0.012341329345350741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 114.53333333333335, 110, 120, 114.0, 118.8, 120.0, 120.0, 0.0747186841541596, 0.05552824086065962, 0.03750527700706839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 173.26666666666665, 110, 463, 115.0, 396.40000000000003, 463.0, 463.0, 0.07471905634813103, 0.03495645435661911, 0.04177651405714513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 811.3333333333333, 656, 892, 882.5, 892.0, 892.0, 892.0, 0.07470305535496401, 21.965178649244255, 0.042604086257127916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1107.8333333333333, 867, 1290, 1107.0, 1290.0, 1290.0, 1290.0, 0.07431721062736112, 66.87075675822135, 0.04231145878491361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae0ad530-31fc-4865-a683-c3b923a0de34", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.29472114600326266, 1.124719616639478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 301.66666666666663, 111, 344, 340.0, 344.0, 344.0, 344.0, 0.07499531279295045, 0.1327065495906506, 0.041525724954690334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 118.58823529411767, 110, 155, 116.0, 136.6, 155.0, 155.0, 0.09309814187061548, 0.06918719332376795, 0.046730903243648786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 161.0, 108, 461, 114.0, 368.19999999999993, 461.0, 461.0, 0.09310528016474158, 0.024912936294081242, 0.05309910509395418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 153.11764705882354, 109, 349, 114.0, 343.4, 349.0, 349.0, 0.0931073198784128, 0.025095332310978446, 0.054736920475395016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 1, 5.882352941176471, 167.70588235294116, 0, 451, 115.0, 369.3999999999999, 451.0, 451.0, 0.09310528016474158, 0.03392502252326263, 0.05160154773836321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8af321f5-32aa-4a08-8c5a-dd216a7db354", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 152.33333333333331, 111, 336, 116.0, 336.0, 336.0, 336.0, 0.07520399082511313, 0.05588890333780379, 0.04222880344183598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 830.6249999999999, 111, 1427, 1145.0, 1417.9, 1427.0, 1427.0, 0.0722363935980496, 40.63132244802366, 0.03858721415833315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 227.06666666666663, 110, 1181, 114.0, 922.4000000000001, 1181.0, 1181.0, 0.07471942854581048, 8.981810411280641, 0.04307069142868528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 566.1874999999998, 114, 990, 681.5, 933.3000000000001, 990.0, 990.0, 0.07223541521819611, 13.282057710453367, 0.03865723392536276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 239.8, 108, 1008, 114.0, 934.8000000000001, 1008.0, 1008.0, 0.07471905634813103, 2.9467717009045984, 0.04314344471038894], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 578.0833333333334, 113, 1446, 485.5, 1421.4, 1446.0, 1446.0, 0.07994244144216164, 0.015203896944200176, 0.05464164759706345], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e1e8189c-4be1-4652-b3b2-b6a08e901d45", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79d727a7-81e9-4a5c-8c49-8bf94ba66ca3", 3, 0, 0.0, 685.3333333333334, 216, 1025, 815.0, 1025.0, 1025.0, 1025.0, 0.08123036932741254, 0.03675462674645294, 0.05209108970540453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b8406b2-b733-40db-bd1c-31c82409efa7", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 1, 5.882352941176471, 334.2941176470588, 226, 573, 237.0, 515.4, 573.0, 573.0, 0.09303700136271843, 0.15301294514100577, 0.20601966501206742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70d1dd89-b2f5-48e1-9c04-1fd4be833e81", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4ac1ef7-9652-4755-85ce-8e62dca35ba6", 3, 0, 0.0, 643.0, 204, 998, 727.0, 998.0, 998.0, 998.0, 0.03160190032760636, 0.026345204016601533, 0.020265541551231947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c772223-7fba-489f-afb4-46eaec91dcae", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 728.0454545454546, 148, 1375, 667.5, 1284.3, 1364.9499999999998, 1375.0, 0.09505826639647075, 0.05839028277673838, 0.042980446622623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 114.18750000000001, 109, 120, 114.5, 120.0, 120.0, 120.0, 0.07223671973055704, 0.05368373409663467, 0.036259447208502264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 210.43749999999997, 108, 341, 117.5, 340.3, 341.0, 341.0, 0.07223508909746772, 0.08713710332778027, 0.03740493749407447], "isController": false}, {"data": ["login", 22, 0, 0.0, 2847.7272727272725, 1651, 4041, 2841.5, 3842.6, 4012.4999999999995, 4041.0, 0.09543474865957557, 31.26830917008641, 0.18715004999479445], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 118.6, 114, 124, 118.0, 124.0, 124.0, 124.0, 0.07713509955570183, 0.062446286652028136, 0.027419117420190885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae0ad530-31fc-4865-a683-c3b923a0de34", 3, 0, 0.0, 324.0, 242, 441, 289.0, 441.0, 441.0, 441.0, 0.036658683220098735, 0.023568001093650717, 0.02350833526809717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea253f20-4b03-4e5d-b09c-47667bd072fe", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 959.4999999999998, 227, 1537, 1257.5, 1532.1, 1537.0, 1537.0, 0.07219923378563145, 54.02657559316183, 0.15083223718350788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e32df0aa-a78f-445f-b3e4-9f3e0576b4c7", 1, 0, 0.0, 1446.0, 1446, 1446, 1446.0, 1446.0, 1446.0, 1446.0, 0.6915629322268326, 0.12494056881051176, 0.476800224757953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37f0a456-8549-4a04-bf9a-520d5d6f5f11", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.5991293386491557, 1.1194740853658536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 329.7857142857143, 223, 469, 240.0, 467.5, 469.0, 469.0, 0.08017868392417388, 0.12426130018326555, 0.1803237393333715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 975.125, 111, 1410, 1201.0, 1410.0, 1410.0, 1410.0, 0.0989401041344596, 88.78168981968166, 0.18371312548697083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/140f23ae-ba28-4889-b5d8-7ddb91df06e3", 3, 0, 0.0, 355.0, 221, 611, 233.0, 611.0, 611.0, 611.0, 0.026479778275989903, 0.026557355751407843, 0.016980847397037795], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1191.1818181818182, 266, 2409, 1232.5, 1630.2, 2292.8999999999983, 2409.0, 0.09629272989889263, 0.03029664726222261, 0.04344457149735195], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 421.7333333333334, 227, 1291, 234.0, 1114.6000000000001, 1291.0, 1291.0, 0.0746759065655057, 12.01208143376496, 0.16540032664486132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 152.31578947368422, 115, 350, 131.0, 349.0, 350.0, 350.0, 0.1539783133701801, 0.11954371008720034, 0.0547344785808062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e32df0aa-a78f-445f-b3e4-9f3e0576b4c7", 3, 0, 0.0, 408.0, 213, 704, 307.0, 704.0, 704.0, 704.0, 0.04735670649891868, 0.030445799262813936, 0.030368721289996688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 437.2, 226, 1461, 454.0, 883.2000000000003, 1461.0, 1461.0, 0.0918717959711155, 7.460264969743556, 0.20505473836443705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 186.0, 112, 336, 113.0, 336.0, 336.0, 336.0, 0.05797362844057381, 0.043083917229762375, 0.0291000439633349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 162.22222222222223, 109, 341, 112.0, 341.0, 341.0, 341.0, 0.0578882371102192, 0.02515022801533395, 0.032474195514304825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fef85424-c481-45cc-a235-be3e55a9af54", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 302.22222222222223, 113, 1145, 114.0, 1145.0, 1145.0, 1145.0, 0.05797325500502435, 5.809937954526423, 0.03352836905129989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 276.77777777777777, 110, 897, 117.0, 897.0, 897.0, 897.0, 0.05789196073638574, 1.9052209100937851, 0.033537888278164445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 2.609928097345133, 5.470478429203539], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1282.5535714285709, 864, 2400, 1156.0, 1832.8000000000002, 1943.0, 2400.0, 0.24462908115569768, 292.66142789120994, 0.48304687704767646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1191.1818181818182, 266, 2409, 1232.5, 1630.2, 2292.8999999999983, 2409.0, 0.0956376203621188, 0.03009052970200187, 0.04314900449931532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 137.0, 109, 342, 115.0, 319.4000000000001, 342.0, 342.0, 0.08451942256330505, 0.022780625612765813, 0.049770714653977484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 113.5, 109, 117, 114.0, 116.9, 117.0, 117.0, 0.08468332669980608, 0.022824802899557104, 0.04978453386062818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 168.94736842105263, 108, 1101, 113.0, 192.0, 1101.0, 1101.0, 0.1572001820212634, 7.4848245589087, 0.09170549269846523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 182.8421052631579, 111, 678, 115.0, 346.0, 678.0, 678.0, 0.15719497968875393, 2.472799192721045, 0.09185596854859393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 137.7, 110, 342, 115.5, 319.70000000000005, 342.0, 342.0, 0.08451942256330505, 0.022615548615571857, 0.04820248318063491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 115.26315789473686, 110, 122, 115.0, 119.0, 122.0, 122.0, 0.15719367915942747, 0.11682069320344171, 0.07890385848432199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 136.8, 110, 338, 115.5, 316.20000000000005, 338.0, 338.0, 0.0846811753747142, 0.06293200630874757, 0.042505980608010835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 127.36842105263156, 110, 329, 113.0, 164.0, 329.0, 329.0, 0.15719888140585442, 0.05448957936888786, 0.08895763179885162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 167.1, 118, 348, 121.0, 346.2, 348.0, 348.0, 0.08208630554164648, 0.06461090065094441, 0.02917911642300715], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 642.75, 111, 1508, 613.5, 1300.1000000000008, 1508.0, 1508.0, 0.07758303000523685, 0.014578386741706697, 0.05280166666127895], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1473.4545454545455, 975, 2722, 1386.0, 2011.7, 2618.6499999999987, 2722.0, 0.09514295228580943, 0.04924391085105371, 0.043762041529898675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 276.40000000000003, 227, 681, 232.0, 636.4000000000001, 681.0, 681.0, 0.08443592579770841, 0.13085919359469067, 0.18989837608605709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8af321f5-32aa-4a08-8c5a-dd216a7db354", 3, 0, 0.0, 376.66666666666663, 198, 724, 208.0, 724.0, 724.0, 724.0, 0.0869691259602841, 0.039351264676040006, 0.055771216843020735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79d727a7-81e9-4a5c-8c49-8bf94ba66ca3", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["addBook", 59, 10, 16.949152542372882, 1175.7457627118645, 579, 2961, 962.0, 2009.0, 2290.0, 2961.0, 0.29001464819748524, 89.36959601942607, 1.0539720639703498], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e4cc1d92-2957-4328-af95-be74e76d6fa5", 3, 0, 0.0, 961.0, 365, 1508, 1010.0, 1508.0, 1508.0, 1508.0, 0.021542902690708545, 0.025462981663399324, 0.013814947363507758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4ac1ef7-9652-4755-85ce-8e62dca35ba6", 1, 0, 0.0, 1364.0, 1364, 1364, 1364.0, 1364.0, 1364.0, 1364.0, 0.7331378299120235, 0.13245165872434017, 0.505464167888563], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 208.28571428571428, 109, 603, 117.0, 458.5, 467.3, 603.0, 0.24571426064140198, 0.18260600815244815, 0.11877788966552145], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 730.6249999999998, 539, 1032, 672.5, 917.2, 1005.6999999999999, 1032.0, 0.24524616583896086, 72.11051569575461, 0.12334157754596176], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 177.92857142857144, 109, 466, 118.0, 345.3, 368.4499999999999, 466.0, 0.24610408444885867, 0.4354888681848945, 0.11968733794485512], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1071.8749999999995, 747, 1929, 1003.5, 1412.3, 1519.85, 1929.0, 0.2451420291631464, 220.57922875472227, 0.12304980760728247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 135.13333333333333, 112, 350, 119.0, 219.80000000000007, 350.0, 350.0, 0.08730269590724962, 0.06522125231352144, 0.031033380185780137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, 5.747126436781609, 191.12643678160921, 109, 1372, 120.0, 342.5, 445.75, 1100.5, 0.7362305840339513, 1.6149711391793145, 0.3533597726676511], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 119.44444444444446, 116, 127, 119.0, 127.0, 127.0, 127.0, 0.05742542670282342, 0.04447105798372947, 0.020412944648269263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 123.0, 116, 135, 122.5, 134.0, 135.0, 135.0, 0.0845809016324114, 0.06863938403958386, 0.03006586737714624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70d1dd89-b2f5-48e1-9c04-1fd4be833e81", 3, 0, 0.0, 358.0, 202, 502, 370.0, 502.0, 502.0, 502.0, 0.019260771586509753, 0.026552528538043234, 0.012351471362442778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4cc1d92-2957-4328-af95-be74e76d6fa5", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 518.0, 227, 1258, 456.0, 1258.0, 1258.0, 1258.0, 0.0578461933991066, 7.7690400343863475, 0.1284529457370569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da6aa228-8d3d-4da9-8ec7-2cb4259cfae7", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 321.8421052631579, 221, 1216, 233.0, 463.0, 1216.0, 1216.0, 0.15704166563349783, 10.118807315042112, 0.35107561917809355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c13f320c-37c9-4a7e-b7f6-de96fb5c4c0d", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=140f23ae-ba28-4889-b5d8-7ddb91df06e3", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 179.99999999999997, 111, 469, 118.0, 376.19999999999993, 469.0, 469.0, 0.09739831901959999, 0.08075309848402382, 0.034622058713998434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 126.87499999999999, 113, 215, 121.0, 156.90000000000006, 215.0, 215.0, 0.07347099961886919, 0.057040473336915046, 0.026116644395769908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 114.4, 110, 117, 115.0, 117.0, 117.0, 117.0, 0.09193542455779061, 0.06832310360202994, 0.04614727365498474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 188.66666666666669, 111, 343, 115.0, 343.0, 343.0, 343.0, 0.09193711501333089, 0.03380604333302688, 0.05191813382979375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 238.6, 108, 1346, 114.0, 740.6000000000004, 1346.0, 1346.0, 0.09193880553103854, 5.5382416109670745, 0.05352322910537413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 259.73333333333335, 111, 877, 115.0, 583.0000000000002, 877.0, 877.0, 0.09193767851232577, 1.8253100789744658, 0.05361235588768893], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.4601226993865031], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07668711656441718], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 4.545454545454546, 0.07668711656441718], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07668711656441718], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.9202453987730062], "isController": false}, {"data": ["Assertion failed", 1, 4.545454545454546, 0.07668711656441718], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 22, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Test failed: code expected to contain /204/", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

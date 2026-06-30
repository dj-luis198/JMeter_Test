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

    var data = {"OkPercent": 99.62490622655663, "KoPercent": 0.37509377344336087};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.790207522697795, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=743672a6-7b0c-43a5-8e76-29f3db28c894"], "isController": false}, {"data": [0.05172413793103448, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7dcebb37-0a1a-4f0b-a834-241e67152870"], "isController": false}, {"data": [0.875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61cbfefd-8e70-4084-86a9-877d28de2a60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bdd1ee50-569d-4ec6-8d52-0616480ea07b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66795710-8124-46c6-b760-68ce49fd8155"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/994e53bd-92cd-482d-834a-42d50a29fc73"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6020e592-dd48-466c-998a-b1ec2f409613"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae07c0f8-129f-4e4c-8969-17cf82535a17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab33de08-ab01-47ae-a180-6ca7accc5aff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1b9cd79f-1718-4497-a922-b1859b91ecbb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/acb812c8-4246-4187-a063-876370d7ac6f"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5aca07c-2857-447d-953c-919082087388"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62e7da2b-f1eb-4eae-a76f-d54ab787458e"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d103c1cb-9606-4cb4-a900-809670ad2afe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eade1c28-e61a-4186-9d0d-a59eb83ed7e0"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6020e592-dd48-466c-998a-b1ec2f409613"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/61cbfefd-8e70-4084-86a9-877d28de2a60"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab33de08-ab01-47ae-a180-6ca7accc5aff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=994e53bd-92cd-482d-834a-42d50a29fc73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3225806451612903, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/743672a6-7b0c-43a5-8e76-29f3db28c894"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.47413793103448276, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.967032967032967, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5aca07c-2857-447d-953c-919082087388"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eade1c28-e61a-4186-9d0d-a59eb83ed7e0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae07c0f8-129f-4e4c-8969-17cf82535a17"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bdd1ee50-569d-4ec6-8d52-0616480ea07b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae0cb454-0e7e-4f60-9c81-d3dfddbb0a22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c078f642-6485-4c63-b39d-843f9f89865f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acb812c8-4246-4187-a063-876370d7ac6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62e7da2b-f1eb-4eae-a76f-d54ab787458e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d103c1cb-9606-4cb4-a900-809670ad2afe"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 5, 0.37509377344336087, 389.16729182295603, 103, 2265, 131.0, 1054.8000000000031, 1344.3, 1752.2800000000007, 5.1730828935113315, 718.3591021324899, 3.7838272336328003], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=743672a6-7b0c-43a5-8e76-29f3db28c894", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1842.8103448275863, 1363, 2666, 1815.5, 2305.4, 2437.0499999999997, 2666.0, 0.2609403751242841, 313.99751182245484, 1.2830417858894243], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7dcebb37-0a1a-4f0b-a834-241e67152870", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 505.24999999999994, 432, 636, 484.0, 635.1, 636.0, 636.0, 0.061545720777322455, 0.011119099945121731, 0.04183185709083635], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 505.24999999999994, 432, 636, 484.0, 635.1, 636.0, 636.0, 0.0604165722657725, 0.010915103387859289, 0.04106438896189225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61cbfefd-8e70-4084-86a9-877d28de2a60", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 147.7, 105, 354, 114.0, 343.5, 353.5, 354.0, 0.09699462164822961, 0.03323770775035524, 0.054909943524881544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 126.5, 109, 351, 115.0, 121.9, 339.54999999999984, 351.0, 0.09698803652569456, 0.07207802323833355, 0.048683448021686525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 185.9, 109, 899, 114.5, 352.70000000000005, 871.7999999999996, 899.0, 0.09688795876448475, 1.4492224589921714, 0.05663782433244196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 204.89999999999995, 108, 979, 114.0, 410.40000000000015, 950.8999999999996, 979.0, 0.0968795109522287, 4.383424165443563, 0.056538277094777226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdd1ee50-569d-4ec6-8d52-0616480ea07b", 3, 0, 0.0, 293.0, 202, 444, 233.0, 444.0, 444.0, 444.0, 0.01702330490441414, 0.023456917207156595, 0.010916637585187454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66795710-8124-46c6-b760-68ce49fd8155", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.7080619456762749, 1.3230148281596452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/994e53bd-92cd-482d-834a-42d50a29fc73", 3, 0, 0.0, 327.3333333333333, 196, 473, 313.0, 473.0, 473.0, 473.0, 0.08470986869970351, 0.03832900960045179, 0.05432240928984894], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 259.8333333333333, 196, 383, 232.5, 374.3, 383.0, 383.0, 0.06162505263806579, 0.1665400999352937, 0.039839633639062066], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6020e592-dd48-466c-998a-b1ec2f409613", 3, 0, 0.0, 603.6666666666666, 354, 991, 466.0, 991.0, 991.0, 991.0, 0.017481498747159256, 0.024099657289784977, 0.01121046631897908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 154.05882352941177, 109, 344, 116.0, 334.4, 344.0, 344.0, 0.10130685847431871, 0.07528761650288725, 0.05085129419511701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 180.4705882352941, 111, 350, 115.0, 342.8, 350.0, 350.0, 0.10117240968874606, 0.044948725673986785, 0.05670025441885378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 804.6666666666666, 674, 889, 851.0, 889.0, 889.0, 889.0, 0.22101075585678503, 64.98450046964786, 0.1260451966995727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1166.3333333333333, 1024, 1248, 1227.0, 1248.0, 1248.0, 1248.0, 0.21822943187604568, 196.36322640848914, 0.12424585818724085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 264.6666666666667, 113, 344, 337.0, 344.0, 344.0, 344.0, 0.22970903522205205, 0.4064773162327718, 0.12719240524502295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 113.45454545454545, 109, 119, 112.0, 118.8, 119.0, 119.0, 0.05407637550635151, 0.04018761890657569, 0.027143805674086603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 152.63636363636363, 104, 340, 114.0, 339.8, 340.0, 340.0, 0.054075577994189335, 0.021852985709299524, 0.03042711410930149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 241.54545454545453, 108, 1013, 113.0, 897.4000000000004, 1013.0, 1013.0, 0.0540761096663504, 4.4366845952526095, 0.031368368302550916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 218.36363636363637, 104, 845, 111.0, 744.2000000000004, 845.0, 845.0, 0.05407584382896302, 1.458713170048865, 0.03142102253733691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 116.0, 114, 118, 116.0, 118.0, 118.0, 118.0, 0.23368125876304718, 0.1736635135924599, 0.13121750369995328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 761.8333333333333, 109, 1720, 1013.0, 1495.0000000000005, 1720.0, 1720.0, 0.1041576252061453, 52.079818465555654, 0.05626048809420479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 277.0588235294118, 108, 1363, 114.0, 1224.6, 1363.0, 1363.0, 0.10131410351917518, 10.74910744882148, 0.058537296254358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 575.888888888889, 109, 1015, 813.0, 997.9, 1015.0, 1015.0, 0.10401858465379148, 17.004081465332916, 0.05628696632687263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 239.76470588235296, 109, 894, 116.0, 703.5999999999998, 894.0, 894.0, 0.1013128959397367, 3.528724440842208, 0.058635536913651615], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 667.0833333333333, 226, 1562, 577.5, 1402.4000000000005, 1562.0, 1562.0, 0.06038890454527155, 0.010910104825073473, 0.04163531895406417], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 377.6363636363637, 220, 1129, 234.0, 1013.4000000000004, 1129.0, 1129.0, 0.05404555549004579, 5.954079472146885, 0.12029262443989151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 693.9, 226, 1367, 565.0, 1241.7, 1360.9499999999998, 1367.0, 0.08212540549418962, 0.050446171929536404, 0.03713287377325176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 126.22222222222223, 108, 332, 115.0, 138.5000000000003, 332.0, 332.0, 0.10415159843772602, 0.07740172501084913, 0.0522792203095617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 175.11111111111114, 108, 348, 116.0, 339.90000000000003, 348.0, 348.0, 0.10402459603781872, 0.11463474363716221, 0.054472949270672], "isController": false}, {"data": ["login", 20, 0, 0.0, 2711.4500000000003, 1669, 4007, 2765.5, 3734.8, 3994.0, 4007.0, 0.07962068704690853, 14.399832790336836, 0.13993491257648563], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 126.23529411764707, 115, 181, 120.0, 150.59999999999997, 181.0, 181.0, 0.09909358514762029, 0.08022322469470432, 0.03522467284544315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae07c0f8-129f-4e4c-8969-17cf82535a17", 3, 0, 0.0, 693.3333333333333, 378, 1319, 383.0, 1319.0, 1319.0, 1319.0, 0.01678359236010876, 0.023137536993834827, 0.010762915673637451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab33de08-ab01-47ae-a180-6ca7accc5aff", 3, 0, 0.0, 297.3333333333333, 204, 463, 225.0, 463.0, 463.0, 463.0, 0.022447864833923213, 0.02653261627993984, 0.014395277904566644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b9cd79f-1718-4497-a922-b1859b91ecbb", 1, 0, 0.0, 1168.0, 1168, 1168, 1168.0, 1168.0, 1168.0, 1168.0, 0.8561643835616438, 0.27340405607876717, 0.5108558968321918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acb812c8-4246-4187-a063-876370d7ac6f", 3, 0, 0.0, 487.0, 233, 666, 562.0, 666.0, 666.0, 666.0, 0.029764857624764364, 0.02985205935608691, 0.01908749007838079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 915.3333333333333, 227, 1835, 1129.0, 1613.6000000000004, 1835.0, 1835.0, 0.10394710247451852, 69.1587503248347, 0.21900400268530015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5aca07c-2857-447d-953c-919082087388", 3, 0, 0.0, 401.3333333333333, 270, 553, 381.0, 553.0, 553.0, 553.0, 0.09107744618840888, 0.041210172591760526, 0.05840578417681168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62e7da2b-f1eb-4eae-a76f-d54ab787458e", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 367.90000000000003, 225, 1089, 235.0, 679.7000000000004, 1069.3499999999997, 1089.0, 0.09682276109467815, 5.934237715914757, 0.21651800842842137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d103c1cb-9606-4cb4-a900-809670ad2afe", 3, 0, 0.0, 417.66666666666663, 222, 705, 326.0, 705.0, 705.0, 705.0, 0.02276469650865438, 0.02690710059339976, 0.014598454466812868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1282.6666666666667, 1140, 1363, 1345.0, 1363.0, 1363.0, 1363.0, 0.2164189871591401, 258.9123480558361, 0.4879994544438032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eade1c28-e61a-4186-9d0d-a59eb83ed7e0", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1170.6190476190475, 362, 2265, 1146.0, 1721.8, 2212.0999999999995, 2265.0, 0.08365200764818355, 0.02670142208413002, 0.03774143313814532], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 507.7058823529411, 228, 1522, 451.0, 1487.6, 1522.0, 1522.0, 0.10110080940118585, 14.36786649229255, 0.22433484402226597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 118.36363636363636, 112, 132, 118.0, 130.0, 132.0, 132.0, 0.08648206676415554, 0.06714183894287466, 0.030741672170070913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 25, 0, 0.0, 302.32, 227, 468, 232.0, 455.20000000000005, 466.5, 468.0, 0.11760721073330448, 0.1822682064782756, 0.26450137335820334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6020e592-dd48-466c-998a-b1ec2f409613", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 153.18181818181822, 109, 344, 113.0, 341.8, 344.0, 344.0, 0.05411255411255411, 0.0402145055465368, 0.02716196563852814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 134.00000000000003, 108, 341, 113.0, 297.40000000000015, 341.0, 341.0, 0.054110158444382134, 0.02186696033725386, 0.030446571752529652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61cbfefd-8e70-4084-86a9-877d28de2a60", 3, 0, 0.0, 517.6666666666666, 275, 931, 347.0, 931.0, 931.0, 931.0, 0.021054995648634233, 0.024886292057353807, 0.01350206426686505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 259.2727272727273, 109, 1268, 114.0, 1083.6000000000008, 1268.0, 1268.0, 0.05411308651206722, 4.439718367518866, 0.031389817761882745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 238.36363636363635, 110, 798, 115.0, 708.4000000000003, 798.0, 798.0, 0.05411308651206722, 1.4597178033284468, 0.031442662572929686], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1254.2241379310349, 859, 2176, 1132.5, 1810.1000000000001, 1944.0499999999997, 2176.0, 0.2594126539703554, 310.34772057902694, 0.5122386585234947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1170.6190476190475, 362, 2265, 1146.0, 1721.8, 2212.0999999999995, 2265.0, 0.08385442871175638, 0.0267660341646901, 0.03783275982893697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab33de08-ab01-47ae-a180-6ca7accc5aff", 1, 0, 0.0, 1030.0, 1030, 1030, 1030.0, 1030.0, 1030.0, 1030.0, 0.970873786407767, 0.17540200242718446, 0.6693719660194175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 175.42857142857144, 110, 325, 117.0, 325.0, 325.0, 325.0, 0.04024168003265325, 0.01084639032130107, 0.023697004941103425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=994e53bd-92cd-482d-834a-42d50a29fc73", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 147.0, 110, 348, 113.0, 348.0, 348.0, 348.0, 0.040235666043971836, 0.010844769363414284, 0.02365417085788188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 256.7272727272727, 107, 1255, 114.0, 1074.8000000000006, 1255.0, 1255.0, 0.08959624673177327, 7.350940926038299, 0.05197282281120442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 244.63636363636363, 105, 674, 117.0, 608.2000000000003, 674.0, 674.0, 0.08959478721238037, 2.416848019751578, 0.05205947108531867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 144.57142857142856, 109, 324, 114.0, 324.0, 324.0, 324.0, 0.04028985674078082, 0.010780684323216742, 0.02297780892247656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 156.0909090909091, 108, 342, 115.0, 341.8, 342.0, 342.0, 0.08943016723441272, 0.06646128639198055, 0.044889751912586075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 118.14285714285714, 113, 137, 115.0, 137.0, 137.0, 137.0, 0.04028892917781807, 0.029941284281562057, 0.02022315390370946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 192.1818181818182, 107, 344, 115.0, 342.0, 344.0, 344.0, 0.08943671133081826, 0.03614310280343437, 0.05032403022147782], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 639.1666666666667, 439, 1319, 548.5, 1202.6000000000004, 1319.0, 1319.0, 0.0606747026939568, 0.010961738279669928, 0.04129908962664833], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 123.28571428571429, 112, 138, 123.0, 138.0, 138.0, 138.0, 0.03990650476027592, 0.03141078402029531, 0.014185515364004333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1391.4499999999998, 883, 2138, 1431.5, 1897.3000000000004, 2126.7999999999997, 2138.0, 0.08132428465126114, 0.042091670766766016, 0.037405994209710934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 298.85714285714283, 229, 463, 242.0, 463.0, 463.0, 463.0, 0.04020839436393192, 0.062315158062070275, 0.0904296213087258], "isController": false}, {"data": ["addBook", 62, 2, 3.225806451612903, 1215.2096774193549, 605, 2503, 936.5, 2072.4, 2297.5999999999995, 2503.0, 0.2752106249056738, 85.98516595311654, 1.0021640932253797], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 193.81034482758616, 109, 471, 117.0, 458.1, 459.2, 471.0, 0.26046227563195784, 0.19356620288664053, 0.12590705706818273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/743672a6-7b0c-43a5-8e76-29f3db28c894", 3, 0, 0.0, 326.3333333333333, 216, 544, 219.0, 544.0, 544.0, 544.0, 0.022667170381564038, 0.02719027436720816, 0.014535913298073291], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 711.9999999999998, 532, 1033, 662.5, 924.9000000000001, 1014.1, 1033.0, 0.25996611476159315, 76.43866942731258, 0.1307446768576372], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 171.2413793103448, 106, 464, 118.0, 345.4, 354.6999999999998, 464.0, 0.26088403704553326, 0.4616424561782288, 0.12687524457878474], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1057.1206896551728, 740, 1731, 1012.5, 1425.8, 1541.05, 1731.0, 0.26009668421571885, 234.0354536585065, 0.13055634344421824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 25, 0, 0.0, 136.27999999999997, 111, 343, 118.0, 206.40000000000043, 338.2, 343.0, 0.11841606669192876, 0.08846512794856005, 0.042093211206896554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 2, 1.098901098901099, 202.96703296703294, 106, 1775, 122.0, 315.1000000000006, 425.69999999999976, 1550.0699999999965, 0.732438577781355, 1.5245984415558282, 0.3540753843290339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 140.36363636363635, 113, 342, 119.0, 300.0000000000001, 342.0, 342.0, 0.05413039520109442, 0.04191933925241004, 0.01924166391913903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 119.60000000000001, 110, 145, 118.0, 127.7, 144.14999999999998, 145.0, 0.09483841904355454, 0.07696359982929085, 0.03371209426938853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5aca07c-2857-447d-953c-919082087388", 1, 0, 0.0, 1562.0, 1562, 1562, 1562.0, 1562.0, 1562.0, 1562.0, 0.6402048655569782, 0.11566201184379, 0.4413912451984635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eade1c28-e61a-4186-9d0d-a59eb83ed7e0", 3, 0, 0.0, 406.33333333333337, 223, 771, 225.0, 771.0, 771.0, 771.0, 0.016506371459383322, 0.022755365602372516, 0.010585140551752976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae07c0f8-129f-4e4c-8969-17cf82535a17", 1, 0, 0.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 720.0, 1.3888888888888888, 0.2509223090277778, 0.9575737847222222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 437.3636363636363, 223, 1613, 231.0, 1425.8000000000006, 1613.0, 1613.0, 0.05407983166423307, 5.957855602547652, 0.12036891509712247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 515.9090909090909, 223, 1370, 440.0, 1235.2000000000005, 1370.0, 1370.0, 0.0891879839461629, 9.825643192321726, 0.19851135879920542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bdd1ee50-569d-4ec6-8d52-0616480ea07b", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 771.0, 1.297016861219196, 0.23432433527885863, 0.8942323281452659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae0cb454-0e7e-4f60-9c81-d3dfddbb0a22", 1, 0, 0.0, 1876.0, 1876, 1876, 1876.0, 1876.0, 1876.0, 1876.0, 0.5330490405117271, 0.17022171508528786, 0.31805953491471217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c078f642-6485-4c63-b39d-843f9f89865f", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.7884837962962963, 1.4732831790123455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acb812c8-4246-4187-a063-876370d7ac6f", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 138.1818181818182, 111, 341, 119.0, 298.0000000000001, 341.0, 341.0, 0.0571173397858619, 0.04735607566230152, 0.020303429377005595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62e7da2b-f1eb-4eae-a76f-d54ab787458e", 3, 0, 0.0, 304.0, 232, 439, 241.0, 439.0, 439.0, 439.0, 0.041816509157815505, 0.02688398619358256, 0.026815925469041844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 145.11111111111106, 111, 344, 119.0, 339.5, 344.0, 344.0, 0.10474007005946909, 0.08131675361062296, 0.0372318217789519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 25, 0, 0.0, 113.88, 106, 119, 115.0, 118.0, 118.7, 119.0, 0.11778840490942072, 0.08753610950788004, 0.05912425793304907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 25, 0, 0.0, 132.35999999999999, 107, 349, 113.0, 228.2000000000004, 343.9, 349.0, 0.11779284479143598, 0.03151878854770846, 0.06717873179511584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 25, 0, 0.0, 166.52, 103, 345, 115.0, 342.6, 345.0, 345.0, 0.11779006982595339, 0.0317481047577765, 0.06924767776877339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 25, 0, 0.0, 174.92, 108, 347, 114.0, 331.8, 344.6, 347.0, 0.11767197759525547, 0.031716275211221195, 0.0692931664940811], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d103c1cb-9606-4cb4-a900-809670ad2afe", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 60.0, 0.2250562640660165], "isController": false}, {"data": ["401/Unauthorized", 2, 40.0, 0.15003750937734434], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 5, "406/Not Acceptable", 3, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

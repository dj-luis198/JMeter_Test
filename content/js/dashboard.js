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

    var data = {"OkPercent": 99.53846153846153, "KoPercent": 0.46153846153846156};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7710683477106834, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2fb9f122-f432-41fe-b387-c3eae937cbd6"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48cbfcca-70a4-4f96-9b6b-39f2b627221d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/70198ddc-2cde-4530-b94e-4bc31af6611b"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0198c40-618a-4785-8536-04425b6a48f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21224777-60bc-4aa9-b95e-d684e0c941af"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0490b3ec-cdfa-4c94-9f5d-e69501392edc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90e3d30b-a46e-4464-932a-c606802742c7"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21224777-60bc-4aa9-b95e-d684e0c941af"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=393c378a-390c-400c-998d-012c271c61d3"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67eb0990-e175-4b49-94ab-c0e58bbac045"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd7436b1-d320-41d6-9232-eff21e867e4f"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21bfc5b1-70ca-4fa1-a740-068434e6e7ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02e001eb-506f-4f49-8fe2-779299d459eb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=340b0fc6-daab-4f09-a887-1bafbd42a6ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bda4bb23-35ba-4d6f-abd4-498a60572a97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ffade11-a077-4ca5-a8e5-01c1f19f149d"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82f7cc2c-5374-4c40-98cb-eba42e36d7b8"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48cbfcca-70a4-4f96-9b6b-39f2b627221d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82f7cc2c-5374-4c40-98cb-eba42e36d7b8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/340b0fc6-daab-4f09-a887-1bafbd42a6ce"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0198c40-618a-4785-8536-04425b6a48f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/393c378a-390c-400c-998d-012c271c61d3"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0490b3ec-cdfa-4c94-9f5d-e69501392edc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6794442d-fe75-4af0-a7d3-e76ac300184b"], "isController": false}, {"data": [0.9767441860465116, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90e3d30b-a46e-4464-932a-c606802742c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ca88df1-0228-4ac6-9ded-f3a631a6e137"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ce85cff-6655-4187-88a9-2869f413e721"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70198ddc-2cde-4530-b94e-4bc31af6611b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2fb9f122-f432-41fe-b387-c3eae937cbd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02e001eb-506f-4f49-8fe2-779299d459eb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/21bfc5b1-70ca-4fa1-a740-068434e6e7ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 6, 0.46153846153846156, 439.98000000000053, 136, 2139, 160.0, 1176.0, 1339.8000000000002, 1703.96, 5.144440047487138, 741.8987783500693, 3.751576721408785], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2084.8620689655168, 1723, 2763, 2075.5, 2478.6, 2564.2999999999997, 2763.0, 0.25108333802310834, 302.13893563256767, 1.2345748114710453], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2fb9f122-f432-41fe-b387-c3eae937cbd6", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 787.4166666666669, 409, 1251, 787.5, 1244.7, 1251.0, 1251.0, 0.09764830336072912, 0.017641539181381723, 0.06637033119049557], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 787.4166666666669, 409, 1251, 787.5, 1244.7, 1251.0, 1251.0, 0.09884027411702688, 0.017856885460595676, 0.0671804988139167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48cbfcca-70a4-4f96-9b6b-39f2b627221d", 3, 0, 0.0, 676.0, 246, 1416, 366.0, 1416.0, 1416.0, 1416.0, 0.03348924437101618, 0.027918605089248837, 0.02147585006865295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 220.5, 139, 450, 147.5, 448.3, 449.95, 450.0, 0.09375849686377828, 0.0321287661616209, 0.05307793030462136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 176.5, 140, 453, 148.0, 400.4000000000006, 451.75, 453.0, 0.0937541017419512, 0.06967467912658679, 0.04706016435094035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 220.45, 142, 733, 146.5, 446.5, 718.6999999999998, 733.0, 0.09375761780644679, 1.4023997115781281, 0.05480791994037015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 249.5, 143, 1294, 150.5, 445.70000000000005, 1251.6499999999994, 1294.0, 0.09375585974123382, 4.242090997386556, 0.05471533377086068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70198ddc-2cde-4530-b94e-4bc31af6611b", 3, 0, 0.0, 554.6666666666666, 236, 837, 591.0, 837.0, 837.0, 837.0, 0.019900365503379744, 0.02352155831470438, 0.012761627617727245], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 258.1666666666667, 224, 335, 242.5, 327.8, 335.0, 335.0, 0.09754987237225031, 0.2226388485253711, 0.06306446827190401], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0198c40-618a-4785-8536-04425b6a48f5", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 148.04761904761907, 143, 157, 148.0, 152.8, 156.6, 157.0, 0.10313784618709204, 0.07664834076989947, 0.05177036419938019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 161.5238095238095, 142, 428, 149.0, 155.4, 400.7999999999996, 428.0, 0.10314139211410385, 0.027598380311781693, 0.05882282519007485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1015.6666666666666, 956, 1047, 1044.0, 1047.0, 1047.0, 1047.0, 0.06972528238739367, 20.501548119160507, 0.03976520011156045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1019.6666666666666, 993, 1035, 1031.0, 1035.0, 1035.0, 1035.0, 0.06974635575291191, 62.75789350748611, 0.039709106839792625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 442.3333333333333, 429, 449, 449.0, 449.0, 449.0, 449.0, 0.07073636556553724, 0.12517020937964207, 0.03916749929263634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 174.58333333333334, 140, 447, 149.5, 366.9000000000003, 447.0, 447.0, 0.07254042617500378, 0.05390943781169714, 0.03641189360737494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 193.74999999999997, 138, 437, 149.0, 434.0, 437.0, 437.0, 0.07253823369400955, 0.028488730127546394, 0.04086178821858188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 363.75, 144, 1299, 284.0, 1044.900000000001, 1299.0, 1299.0, 0.07253998766820209, 5.457223178717372, 0.04212608658856528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 267.49999999999994, 142, 742, 147.0, 653.8000000000003, 742.0, 742.0, 0.07253954916670192, 1.7953420353086256, 0.04219667134143761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 242.33333333333334, 149, 428, 150.0, 428.0, 428.0, 428.0, 0.07120309496119431, 0.052915581313934444, 0.03998220664324876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 175.7142857142857, 141, 446, 147.0, 385.0000000000002, 445.6, 446.0, 0.10313835273316635, 0.02779900913511124, 0.06063407064977162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 830.6111111111113, 138, 1491, 1274.0, 1370.4, 1491.0, 1491.0, 0.16597969515062655, 82.99145046082418, 0.08965352891274078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 175.95238095238096, 138, 447, 149.0, 378.0000000000002, 445.59999999999997, 447.0, 0.10313733964599336, 0.02779873607645915, 0.060734195123568355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 696.3333333333334, 148, 1178, 864.0, 1155.5, 1178.0, 1178.0, 0.16552028543053665, 27.057861121583844, 0.08956702077279582], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 647.0, 235, 1463, 568.5, 1346.6000000000004, 1463.0, 1463.0, 0.09879714476251637, 0.017849093536196806, 0.06811600019759428], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21224777-60bc-4aa9-b95e-d684e0c941af", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0490b3ec-cdfa-4c94-9f5d-e69501392edc", 3, 0, 0.0, 364.3333333333333, 228, 556, 309.0, 556.0, 556.0, 556.0, 0.02594145877469843, 0.02601745914220243, 0.016635635998097628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90e3d30b-a46e-4464-932a-c606802742c7", 3, 0, 0.0, 335.0, 266, 404, 335.0, 404.0, 404.0, 404.0, 0.02589399000491986, 0.025969851303762396, 0.016605195413311236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 541.0, 288, 1449, 452.5, 1277.4000000000005, 1449.0, 1449.0, 0.07247514706415259, 7.3284181563077535, 0.1614530172309662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21224777-60bc-4aa9-b95e-d684e0c941af", 3, 0, 0.0, 440.6666666666667, 254, 603, 465.0, 603.0, 603.0, 603.0, 0.04384106153823671, 0.027272222851422643, 0.028114222405705182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=393c378a-390c-400c-998d-012c271c61d3", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 421.3636363636363, 156, 1439, 349.0, 694.3999999999999, 1332.3499999999985, 1439.0, 0.09989329579767067, 0.06136023736009263, 0.04516659761164211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 163.61111111111111, 137, 450, 148.5, 181.8000000000004, 450.0, 450.0, 0.16598428682084762, 0.12335355690494633, 0.08331633147062079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 161.16666666666666, 136, 432, 147.5, 179.1000000000004, 432.0, 432.0, 0.1659858174340437, 0.18291579447267228, 0.086919222540874], "isController": false}, {"data": ["login", 22, 0, 0.0, 2256.681818181818, 1303, 3390, 2146.5, 3183.7999999999997, 3379.0499999999997, 3390.0, 0.09611645819589408, 15.815573235006925, 0.1667531805809803], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 167.5238095238095, 145, 450, 154.0, 160.8, 421.09999999999957, 450.0, 0.10566250389944955, 0.08554122630140984, 0.037559718183007455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67eb0990-e175-4b49-94ab-c0e58bbac045", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.9618552334337349, 1.7972279743975903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd7436b1-d320-41d6-9232-eff21e867e4f", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1029.4444444444441, 293, 1629, 1423.5, 1509.3000000000002, 1629.0, 1629.0, 0.1652983635462009, 109.97736330743659, 0.348263707137216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21bfc5b1-70ca-4fa1-a740-068434e6e7ae", 1, 0, 0.0, 1075.0, 1075, 1075, 1075.0, 1075.0, 1075.0, 1075.0, 0.930232558139535, 0.16805959302325582, 0.6413517441860466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02e001eb-506f-4f49-8fe2-779299d459eb", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=340b0fc6-daab-4f09-a887-1bafbd42a6ce", 1, 0, 0.0, 1463.0, 1463, 1463, 1463.0, 1463.0, 1463.0, 1463.0, 0.6835269993164731, 0.12348876452494872, 0.47125982570061514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bda4bb23-35ba-4d6f-abd4-498a60572a97", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ffade11-a077-4ca5-a8e5-01c1f19f149d", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 501.8000000000001, 289, 1445, 314.5, 898.9000000000001, 1417.8499999999995, 1445.0, 0.09368866320330908, 5.7421498049519135, 0.20950944323169673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1284.6666666666667, 1186, 1475, 1193.0, 1475.0, 1475.0, 1475.0, 0.06948143687611459, 83.12395415962202, 0.1566724977997545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82f7cc2c-5374-4c40-98cb-eba42e36d7b8", 3, 0, 0.0, 380.3333333333333, 239, 550, 352.0, 550.0, 550.0, 550.0, 0.024124482328816692, 0.024195159523139397, 0.015470452535081017], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1098.5454545454545, 174, 1718, 1159.5, 1655.2, 1708.85, 1718.0, 0.09727110340802575, 0.03107079457227243, 0.04388598610791787], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48cbfcca-70a4-4f96-9b6b-39f2b627221d", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 167.16666666666666, 140, 431, 153.0, 190.7000000000004, 431.0, 431.0, 0.08204230648270959, 0.06369495473999426, 0.02916347613252567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 354.9523809523809, 291, 596, 302.0, 586.0, 595.1, 596.0, 0.10305989743086398, 0.15972271213162223, 0.23178412478835916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82f7cc2c-5374-4c40-98cb-eba42e36d7b8", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/340b0fc6-daab-4f09-a887-1bafbd42a6ce", 3, 0, 0.0, 736.0, 311, 1316, 581.0, 1316.0, 1316.0, 1316.0, 0.020010672358591247, 0.027586327291221988, 0.012832364761205977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 607.5333333333333, 300, 1473, 584.0, 1119.6000000000001, 1473.0, 1473.0, 0.11973753532257292, 9.723046457165893, 0.2672501252255057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0198c40-618a-4785-8536-04425b6a48f5", 3, 0, 0.0, 516.0, 248, 868, 432.0, 868.0, 868.0, 868.0, 0.048402710551790906, 0.031118279081961926, 0.03103949862858987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 151.0, 145, 161, 149.0, 161.0, 161.0, 161.0, 0.02938497252505069, 0.021837855558167554, 0.014749878786988335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 148.2, 145, 152, 148.0, 152.0, 152.0, 152.0, 0.029385317919754572, 0.00786286827149683, 0.016758814126110032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 148.8, 144, 151, 151.0, 151.0, 151.0, 151.0, 0.029385145221387684, 0.007920214922952149, 0.017275251389917368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 206.4, 138, 448, 150.0, 448.0, 448.0, 448.0, 0.029384627138466242, 0.007920075283414728, 0.017303642738764786], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1368.379310344827, 1125, 2139, 1192.5, 1888.9, 1948.1999999999998, 2139.0, 0.2517120761038443, 301.1351522966557, 0.49703302527536436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1098.5454545454545, 174, 1718, 1159.5, 1655.2, 1708.85, 1718.0, 0.09652213208615039, 0.030831554620558338, 0.04354807131230613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 196.0, 138, 443, 150.0, 443.0, 443.0, 443.0, 0.04534530449371967, 0.01222197660182288, 0.026702361923547815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 195.5, 139, 441, 148.5, 441.0, 441.0, 441.0, 0.04544593826926718, 0.01224910054913842, 0.026717241052830902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 406.7222222222223, 143, 1380, 150.0, 1319.7, 1380.0, 1380.0, 0.08063396212891578, 16.14014392602282, 0.045864065698760476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 322.3333333333333, 142, 1005, 149.5, 996.9, 1005.0, 1005.0, 0.0806346845615937, 5.285631571166828, 0.0459432214228438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 180.77777777777777, 144, 444, 149.0, 442.2, 444.0, 444.0, 0.08063107252764973, 0.05992211542338032, 0.040473018827355434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 144.0, 138, 149, 145.5, 149.0, 149.0, 149.0, 0.0454500693113557, 0.012161444327452598, 0.025920742654132547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 178.8333333333333, 142, 445, 147.0, 431.5, 445.0, 445.0, 0.08063251730239435, 0.048488000313570895, 0.04448087217506215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 145.83333333333334, 139, 151, 147.5, 151.0, 151.0, 151.0, 0.04544628249409198, 0.03377404392383203, 0.022811903517542264], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 667.6666666666667, 402, 1522, 553.0, 1490.2, 1522.0, 1522.0, 0.09965784141115504, 0.018004590489320002, 0.06783351119489751], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 202.0, 149, 443, 154.0, 443.0, 443.0, 443.0, 0.04486652209676213, 0.035314860166006136, 0.015948646526583416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1283.4545454545455, 838, 1750, 1255.5, 1639.0, 1733.3499999999997, 1750.0, 0.09765321567600438, 0.050543168269806954, 0.04491666463222467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 393.3333333333333, 289, 595, 299.0, 595.0, 595.0, 595.0, 0.04529395778603134, 0.0701967880922185, 0.10186717263792011], "isController": false}, {"data": ["addBook", 57, 3, 5.2631578947368425, 1382.7192982456145, 762, 2781, 1198.0, 2149.4, 2314.5999999999985, 2781.0, 0.2730630488207988, 98.47564499168834, 0.9907330724862631], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 257.2241379310346, 144, 618, 151.0, 594.1, 606.05, 618.0, 0.2528533189177878, 0.18791149970355128, 0.12222889928154781], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 832.603448275862, 678, 1203, 743.0, 1050.0, 1178.1, 1203.0, 0.2528004184282788, 74.33171678180709, 0.12714083544000349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/393c378a-390c-400c-998d-012c271c61d3", 3, 0, 0.0, 480.3333333333333, 238, 628, 575.0, 628.0, 628.0, 628.0, 0.026737967914438502, 0.026816301804812835, 0.017146418226381462], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 243.34482758620695, 140, 603, 151.5, 445.0, 457.49999999999966, 603.0, 0.25341343528126703, 0.4484229929000546, 0.12324208083014745], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1104.4310344827584, 968, 1482, 1033.5, 1336.4, 1350.1999999999998, 1482.0, 0.25243183252453594, 227.13860663340807, 0.12670894718516745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 151.6, 140, 166, 152.0, 162.4, 166.0, 166.0, 0.11484836187953172, 0.08579980159945486, 0.040825003636864796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0490b3ec-cdfa-4c94-9f5d-e69501392edc", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.2548153208744711, 0.9724303596614952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6794442d-fe75-4af0-a7d3-e76ac300184b", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 3, 1.744186046511628, 203.57558139534888, 139, 1887, 154.0, 309.00000000000017, 376.5999999999999, 826.3100000000148, 0.7161504415567111, 1.5863890299908816, 0.3426688457382803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 153.4, 147, 159, 154.0, 159.0, 159.0, 159.0, 0.030724986788255682, 0.023793861838951907, 0.010921772647387761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90e3d30b-a46e-4464-932a-c606802742c7", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 180.8, 146, 443, 152.0, 412.2000000000006, 442.85, 443.0, 0.0937141250614999, 0.0760512089122133, 0.03331244289295504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 360.8, 293, 609, 301.0, 609.0, 609.0, 609.0, 0.02935909104254132, 0.0455008569184698, 0.06602928385837174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ca88df1-0228-4ac6-9ded-f3a631a6e137", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ce85cff-6655-4187-88a9-2869f413e721", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 589.2777777777776, 291, 1756, 302.0, 1684.9, 1756.0, 1756.0, 0.08057729152864074, 21.51900679814941, 0.17663878263380306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70198ddc-2cde-4530-b94e-4bc31af6611b", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 153.08333333333331, 147, 158, 152.5, 157.7, 158.0, 158.0, 0.0726348284002179, 0.060221649718540035, 0.025819411657889958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fb9f122-f432-41fe-b387-c3eae937cbd6", 3, 0, 0.0, 381.6666666666667, 225, 518, 402.0, 518.0, 518.0, 518.0, 0.02836316192529143, 0.028446257126244434, 0.018188616208601602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 151.49999999999997, 145, 167, 152.0, 155.3, 167.0, 167.0, 0.16537581654309416, 0.128392357570078, 0.05878593478680301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02e001eb-506f-4f49-8fe2-779299d459eb", 3, 0, 0.0, 307.6666666666667, 225, 465, 233.0, 465.0, 465.0, 465.0, 0.0644122383252818, 0.029144860440150293, 0.041306025228126673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21bfc5b1-70ca-4fa1-a740-068434e6e7ae", 3, 0, 0.0, 666.0, 224, 1522, 252.0, 1522.0, 1522.0, 1522.0, 0.022737608003638016, 0.022804222089586174, 0.014581083257541308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 168.6, 139, 446, 150.0, 270.80000000000007, 446.0, 446.0, 0.1201643848785138, 0.0893018524341299, 0.060316888503472756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 267.0, 137, 566, 148.0, 492.20000000000005, 566.0, 566.0, 0.12017497476325531, 0.044189339678572, 0.0678644356182602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 351.00000000000006, 140, 1323, 151.0, 885.6000000000003, 1323.0, 1323.0, 0.11987916180490066, 7.221322469450794, 0.0697890276601186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 350.1333333333333, 143, 735, 429.0, 639.0, 735.0, 735.0, 0.11989832621936598, 2.3804345165299825, 0.06991727265279044], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 50.0, 0.23076923076923078], "isController": false}, {"data": ["401/Unauthorized", 3, 50.0, 0.23076923076923078], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 6, "406/Not Acceptable", 3, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

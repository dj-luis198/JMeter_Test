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

    var data = {"OkPercent": 99.25595238095238, "KoPercent": 0.7440476190476191};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7451923076923077, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5bf6f309-775f-4583-9650-594d90866d9a"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/307530e3-e589-446a-9c9d-551127bf789b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9920f4c-e3de-4368-9fe7-0d41ffe24a9e"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c915d62-5896-48ef-8f32-1ee5c30b0d78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a418168b-53f7-4281-b531-85abb7582019"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c9f94a6-63d7-4f5b-82ee-fdce1269bc74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b5f63b9-6b9e-4ed4-87c6-cc5b496c58f3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/92c9e206-d7ce-454d-bcaa-ff6ad862eba3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75122ab9-85e3-4c77-bd99-895a063f9700"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/53e3e404-a5c3-4f86-b1d9-7e270cb370d7"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3c5ecf5-7d76-40fd-bd12-f14889c763c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7c915d62-5896-48ef-8f32-1ee5c30b0d78"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d6d6970c-f91e-4b74-92db-5157ce4ab44e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c9b746e3-3c78-43a3-8cce-244bd49daf9a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/061239c6-9ea6-4086-970a-386783999153"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dc2a48df-73a5-4869-926b-92646ef14131"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b5f63b9-6b9e-4ed4-87c6-cc5b496c58f3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bf6f309-775f-4583-9650-594d90866d9a"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/867f50f1-36a2-4083-bfc2-fba5cc52aa3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=307530e3-e589-446a-9c9d-551127bf789b"], "isController": false}, {"data": [0.31746031746031744, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70a5e35c-8a4b-47fe-b1a5-09b2128f933a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9480874316939891, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c9f94a6-63d7-4f5b-82ee-fdce1269bc74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a418168b-53f7-4281-b531-85abb7582019"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/75122ab9-85e3-4c77-bd99-895a063f9700"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53e3e404-a5c3-4f86-b1d9-7e270cb370d7"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/20414e2c-736a-4ec1-9aa7-f3d3f2faec29"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92c9e206-d7ce-454d-bcaa-ff6ad862eba3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6d6970c-f91e-4b74-92db-5157ce4ab44e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=061239c6-9ea6-4086-970a-386783999153"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc2a48df-73a5-4869-926b-92646ef14131"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9b746e3-3c78-43a3-8cce-244bd49daf9a"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1344, 10, 0.7440476190476191, 472.3340773809527, 132, 2896, 158.0, 1332.5, 1596.0, 2152.6499999999996, 5.203574360006814, 707.446668293187, 3.8029691879868674], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2332.210526315791, 1731, 2984, 2342.0, 2823.6, 2905.1, 2984.0, 0.25168007488586086, 302.85608849838616, 1.237508961963193], "isController": true}, {"data": ["deleteBook", 13, 0, 0.0, 643.8461538461538, 496, 949, 544.0, 948.2, 949.0, 949.0, 0.09446438692612885, 0.017066319903646324, 0.06420626298885321], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 643.8461538461538, 496, 949, 544.0, 948.2, 949.0, 949.0, 0.09469007211013183, 0.017107093105834366, 0.06435965838735523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 161.875, 132, 441, 143.0, 238.0000000000002, 441.0, 441.0, 0.09494985460803512, 0.03431964349296778, 0.05365269494392025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 144.375, 135, 153, 144.5, 152.3, 153.0, 153.0, 0.09494422027059102, 0.07055913244718727, 0.04765754806551151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bf6f309-775f-4583-9650-594d90866d9a", 3, 0, 0.0, 354.6666666666667, 238, 550, 276.0, 550.0, 550.0, 550.0, 0.019554802333539744, 0.023113114346706647, 0.012540026236026465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 259.5, 133, 1189, 146.0, 652.8000000000005, 1189.0, 1189.0, 0.09494985460803512, 1.7688930738531838, 0.05540286926591894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 270.375, 136, 1439, 143.5, 839.1000000000006, 1439.0, 1439.0, 0.0949504180785596, 5.363777166575673, 0.05531047303111407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/307530e3-e589-446a-9c9d-551127bf789b", 3, 0, 0.0, 493.33333333333337, 233, 940, 307.0, 940.0, 940.0, 940.0, 0.02677686835598954, 0.026855316212501226, 0.017171364147558394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9920f4c-e3de-4368-9fe7-0d41ffe24a9e", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.8607437668463612, 1.6083010444743935], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 339.46153846153845, 233, 544, 346.0, 508.4, 544.0, 544.0, 0.09402302840941966, 0.24072211945987385, 0.060784418756870906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c915d62-5896-48ef-8f32-1ee5c30b0d78", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 143.578947368421, 134, 151, 144.0, 151.0, 151.0, 151.0, 0.1227945453370387, 0.09125649316551412, 0.06163710576488077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 157.57894736842104, 135, 397, 144.0, 151.0, 397.0, 397.0, 0.12278978388998034, 0.032855860142436154, 0.07002854862475442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1132.0, 971, 1262, 1147.5, 1262.0, 1262.0, 1262.0, 0.1477814312631618, 43.45264759670447, 0.08428159751727196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1577.5, 1382, 1737, 1595.5, 1737.0, 1737.0, 1737.0, 0.14650404717430318, 131.82459917408343, 0.08341001904552613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a418168b-53f7-4281-b531-85abb7582019", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 141.5, 139, 144, 141.5, 144.0, 144.0, 144.0, 0.15348016268897247, 0.2715879441332208, 0.08498364477016346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 146.46153846153848, 136, 151, 147.0, 151.0, 151.0, 151.0, 0.06591122265318022, 0.048982851991279434, 0.0330843441833346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 166.46153846153845, 134, 449, 143.0, 329.39999999999986, 449.0, 449.0, 0.06591389617040264, 0.017637116748721017, 0.03759151890968275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 165.92307692307688, 134, 439, 145.0, 323.39999999999986, 439.0, 439.0, 0.06591389617040264, 0.017765854827178833, 0.03875016161580311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 243.84615384615387, 137, 582, 145.0, 525.1999999999999, 582.0, 582.0, 0.06591122265318022, 0.017765134230739978, 0.03881295630846452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c9f94a6-63d7-4f5b-82ee-fdce1269bc74", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 213.75, 140, 423, 146.0, 423.0, 423.0, 423.0, 0.15183146707155057, 0.11283568988422851, 0.08525692731068514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b5f63b9-6b9e-4ed4-87c6-cc5b496c58f3", 1, 0, 0.0, 1169.0, 1169, 1169, 1169.0, 1169.0, 1169.0, 1169.0, 0.8554319931565441, 0.15454581907613343, 0.589780260906758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 917.9444444444445, 142, 1704, 1211.0, 1672.5, 1704.0, 1704.0, 0.09496626059797088, 47.484047399375335, 0.05129579484122169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 157.78947368421052, 133, 437, 143.0, 151.0, 437.0, 437.0, 0.12278819682301698, 0.03309525617495379, 0.07218602977290646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 650.7777777777776, 141, 1192, 851.0, 1192.0, 1192.0, 1192.0, 0.0949672626741726, 15.524447640063524, 0.05138907757770169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 155.47368421052633, 134, 411, 142.0, 148.0, 411.0, 411.0, 0.1227945453370387, 0.03309696729787372, 0.07230967855296323], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 673.2307692307693, 457, 1169, 590.0, 1130.2, 1169.0, 1169.0, 0.09469627989306605, 0.017108214629118376, 0.06528864609814905], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 417.00000000000006, 280, 725, 302.0, 672.5999999999999, 725.0, 725.0, 0.06586080066468745, 0.10207137759263575, 0.1481224843073977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92c9e206-d7ce-454d-bcaa-ff6ad862eba3", 3, 0, 0.0, 759.3333333333334, 268, 1551, 459.0, 1551.0, 1551.0, 1551.0, 0.019416973023352147, 0.0267678648287423, 0.012451639601563714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75122ab9-85e3-4c77-bd99-895a063f9700", 1, 0, 0.0, 879.0, 879, 879, 879.0, 879.0, 879.0, 879.0, 1.1376564277588168, 0.2055336319681456, 0.784360779294653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53e3e404-a5c3-4f86-b1d9-7e270cb370d7", 3, 0, 0.0, 985.3333333333334, 363, 2032, 561.0, 2032.0, 2032.0, 2032.0, 0.027179082977740333, 0.022658083172523758, 0.0174292947480952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 639.1818181818181, 171, 1233, 581.5, 1180.7, 1227.0, 1233.0, 0.09070294784580499, 0.055714994331065755, 0.04101119614512472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 177.38888888888889, 138, 426, 146.0, 426.0, 426.0, 426.0, 0.09495073112062963, 0.0705639710769523, 0.047660816207034794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 252.66666666666669, 136, 437, 145.5, 434.3, 437.0, 437.0, 0.09496926689002032, 0.10465580235840347, 0.04973108528767774], "isController": false}, {"data": ["login", 22, 0, 0.0, 3195.500000000001, 1908, 5666, 3062.5, 4760.4, 5545.0999999999985, 5666.0, 0.09043524014666951, 19.797256780587663, 0.1637131553471891], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b3c5ecf5-7d76-40fd-bd12-f14889c763c6", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.2572281003937007, 2.349132627952756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 149.31578947368422, 139, 166, 149.0, 158.0, 166.0, 166.0, 0.12746288482051213, 0.10319016749629352, 0.04530907233854142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c915d62-5896-48ef-8f32-1ee5c30b0d78", 3, 0, 0.0, 543.0, 269, 805, 555.0, 805.0, 805.0, 805.0, 0.03378036009863865, 0.03387932599736513, 0.021662535610129603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6d6970c-f91e-4b74-92db-5157ce4ab44e", 3, 0, 0.0, 342.3333333333333, 246, 530, 251.0, 530.0, 530.0, 530.0, 0.04865154144300472, 0.03127825336911925, 0.031199067917551854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9b746e3-3c78-43a3-8cce-244bd49daf9a", 3, 0, 0.0, 554.3333333333334, 321, 897, 445.0, 897.0, 897.0, 897.0, 0.047312641937925816, 0.029431789955526116, 0.030340463742745395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/061239c6-9ea6-4086-970a-386783999153", 3, 0, 0.0, 527.6666666666666, 325, 714, 544.0, 714.0, 714.0, 714.0, 0.03801076971808679, 0.031688014729173264, 0.024375395945517898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1096.8333333333335, 286, 1845, 1369.0, 1811.7, 1845.0, 1845.0, 0.09487766052773064, 63.1246112651409, 0.19989578281976408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 470.3125, 278, 1583, 299.0, 981.7000000000006, 1583.0, 1583.0, 0.094863159891856, 7.230913096822678, 0.21183249315206565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1791.5, 1522, 1994, 1825.0, 1994.0, 1994.0, 1994.0, 0.14426371406931873, 172.5895562087496, 0.3252977693223212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc2a48df-73a5-4869-926b-92646ef14131", 3, 0, 0.0, 910.3333333333334, 346, 1537, 848.0, 1537.0, 1537.0, 1537.0, 0.01952870719958339, 0.026921899410884, 0.01252329205181617], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1257.1818181818185, 263, 2175, 1287.5, 2082.8999999999996, 2171.4, 2175.0, 0.09304213963087646, 0.0295712766227395, 0.04197799659127434], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9b5f63b9-6b9e-4ed4-87c6-cc5b496c58f3", 3, 0, 0.0, 383.0, 244, 591, 314.0, 591.0, 591.0, 591.0, 0.02033663916701126, 0.02403721901543551, 0.013041399465824279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 332.5263157894737, 278, 573, 291.0, 559.0, 573.0, 573.0, 0.1226787881918438, 0.19012816099653915, 0.27590746992755494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 153.0, 141, 163, 152.0, 162.3, 163.0, 163.0, 0.11896883760010113, 0.09236350184773476, 0.04228970399066095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 595.4, 281, 1745, 549.0, 1725.8, 1745.0, 1745.0, 0.09699195613377132, 15.601756029262475, 0.21482834242363502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 169.33333333333331, 141, 403, 150.0, 328.60000000000025, 403.0, 403.0, 0.05394082691287658, 0.040086884063182684, 0.027075766634002497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 213.91666666666663, 134, 436, 143.0, 435.7, 436.0, 436.0, 0.05394446417413273, 0.021186196623076543, 0.03038766121527887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 312.16666666666663, 135, 1334, 143.5, 1064.6000000000008, 1334.0, 1334.0, 0.053877133197742545, 4.053206369904682, 0.03128802266431403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bf6f309-775f-4583-9650-594d90866d9a", 1, 0, 0.0, 676.0, 676, 676, 676.0, 676.0, 676.0, 676.0, 1.4792899408284024, 0.2672545303254438, 1.0199010724852071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 252.83333333333331, 134, 1184, 146.0, 953.9000000000008, 1184.0, 1184.0, 0.0538776169930004, 1.3334622514333692, 0.031340918478675685], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1610.2982456140355, 1124, 2377, 1497.0, 2209.8, 2288.2999999999997, 2377.0, 0.2605380796972273, 311.69412100965366, 0.5144609347146423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1257.1818181818185, 263, 2175, 1287.5, 2082.8999999999996, 2171.4, 2175.0, 0.09076544147073022, 0.028847681149255514, 0.040950814413552104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 223.36363636363637, 136, 441, 150.0, 437.6, 441.0, 441.0, 0.10767107465520785, 0.029020719340661492, 0.06340396290731479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 254.0, 144, 449, 150.0, 447.4, 449.0, 449.0, 0.10767107465520785, 0.029020719340661492, 0.0632988153734718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 258.5, 137, 1700, 144.5, 797.0000000000009, 1700.0, 1700.0, 0.12221950623319482, 6.904216011996608, 0.07119524948056709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 228.62500000000003, 135, 1225, 143.5, 672.0000000000006, 1225.0, 1225.0, 0.12224004889601955, 2.277302864046146, 0.07132659103063642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/867f50f1-36a2-4083-bfc2-fba5cc52aa3d", 1, 0, 0.0, 1099.0, 1099, 1099, 1099.0, 1099.0, 1099.0, 1099.0, 0.9099181073703367, 0.2905695518653321, 0.5429296519563239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 146.625, 138, 153, 148.0, 151.6, 153.0, 153.0, 0.12224471864613976, 0.09084788172823471, 0.06136111853917561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 198.0, 141, 440, 147.0, 437.0, 440.0, 440.0, 0.10798499990183182, 0.028894423801857343, 0.06158519525651346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 182.31250000000003, 134, 442, 147.0, 432.2, 442.0, 442.0, 0.12222417441389688, 0.04417795171381209, 0.06906441691429793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 228.54545454545456, 145, 441, 153.0, 440.8, 441.0, 441.0, 0.10797969981643452, 0.08024663238311198, 0.054200747759421235], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 634.9230769230769, 459, 940, 555.0, 922.8, 940.0, 940.0, 0.09673194833025775, 0.017475986758884458, 0.06584196092401334], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 177.36363636363635, 147, 416, 153.0, 365.00000000000017, 416.0, 416.0, 0.10113547556658851, 0.07960468096354525, 0.03595050108031076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1629.727272727273, 806, 2896, 1512.5, 2439.5999999999995, 2845.899999999999, 2896.0, 0.09084339836894807, 0.0470185557964282, 0.04178441467946733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 511.3636363636364, 290, 890, 315.0, 888.4, 890.0, 890.0, 0.10751427007584642, 0.16662611973668778, 0.24180211326628354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=307530e3-e589-446a-9c9d-551127bf789b", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["addBook", 63, 6, 9.523809523809524, 1359.9523809523816, 740, 2896, 1142.0, 2381.8, 2647.7999999999993, 2896.0, 0.29813876229822395, 86.05042966882935, 1.0863449637027887], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 275.1578947368422, 138, 610, 151.0, 590.4, 599.5, 610.0, 0.26215695382818144, 0.19482562681957624, 0.12672626186030253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70a5e35c-8a4b-47fe-b1a5-09b2128f933a", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 900.4561403508769, 670, 1347, 848.0, 1183.8000000000002, 1292.6999999999998, 1347.0, 0.2620328230588884, 77.04635028789133, 0.13178408581574955], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 206.43859649122808, 135, 451, 147.0, 432.8, 450.1, 451.0, 0.2627297156526989, 0.46490844215106497, 0.12777284999516025], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1333.877192982456, 978, 1778, 1309.0, 1655.8000000000002, 1706.4, 1778.0, 0.2612749299829025, 235.09564127095356, 0.13114776758907412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 190.4, 138, 466, 152.0, 436.6, 466.0, 466.0, 0.09455311048215784, 0.07063782179575268, 0.033610675991704544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, 3.278688524590164, 217.8579234972678, 136, 1630, 153.0, 318.79999999999995, 424.19999999999993, 1320.8799999999987, 0.7833334046751734, 1.623103499798816, 0.37913032468741575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 149.33333333333331, 141, 166, 148.5, 163.3, 166.0, 166.0, 0.056019793660426684, 0.043382515988982774, 0.019913286027729796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c9f94a6-63d7-4f5b-82ee-fdce1269bc74", 3, 0, 0.0, 427.3333333333333, 354, 522, 406.0, 522.0, 522.0, 522.0, 0.026163399148817417, 0.026435934556617597, 0.01677796104269867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 205.5625, 136, 444, 149.0, 444.0, 444.0, 444.0, 0.09046550154639466, 0.07341487479009176, 0.03215765875281998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a418168b-53f7-4281-b531-85abb7582019", 3, 0, 0.0, 608.3333333333334, 455, 835, 535.0, 835.0, 835.0, 835.0, 0.04801997631014502, 0.03903186225469796, 0.030794060329096908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 509.25, 280, 1486, 304.0, 1291.9000000000008, 1486.0, 1486.0, 0.05383942391816408, 5.444042927126096, 0.1199381828072773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75122ab9-85e3-4c77-bd99-895a063f9700", 3, 0, 0.0, 718.0, 351, 1251, 552.0, 1251.0, 1251.0, 1251.0, 0.017278916266371774, 0.023820380985704576, 0.011080555027588668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53e3e404-a5c3-4f86-b1d9-7e270cb370d7", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 446.125, 280, 1849, 297.0, 967.700000000001, 1849.0, 1849.0, 0.12208707860881775, 9.30604732829597, 0.27262438098035924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20414e2c-736a-4ec1-9aa7-f3d3f2faec29", 1, 0, 0.0, 1093.0, 1093, 1093, 1093.0, 1093.0, 1093.0, 1093.0, 0.9149130832570906, 0.2921646271729186, 0.5459100526075022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92c9e206-d7ce-454d-bcaa-ff6ad862eba3", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6d6970c-f91e-4b74-92db-5157ce4ab44e", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.2700509155455904, 1.030572683109118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 176.92307692307693, 144, 447, 152.0, 336.19999999999993, 447.0, 447.0, 0.06609183714971327, 0.05479684544932281, 0.023493582736812138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 148.5, 135, 186, 148.0, 156.30000000000004, 186.0, 186.0, 0.09377979462224978, 0.07280755539520369, 0.03333578636962785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=061239c6-9ea6-4086-970a-386783999153", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 143.0, 134, 151, 144.0, 149.2, 151.0, 151.0, 0.09708298005915589, 0.07214858186036878, 0.04873110522500598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 255.13333333333333, 133, 449, 143.0, 437.6, 449.0, 449.0, 0.0970886354515916, 0.04542180562207925, 0.054283671956918536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc2a48df-73a5-4869-926b-92646ef14131", 1, 0, 0.0, 1072.0, 1072, 1072, 1072.0, 1072.0, 1072.0, 1072.0, 0.9328358208955224, 0.16852990904850745, 0.6431465718283582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9b746e3-3c78-43a3-8cce-244bd49daf9a", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 412.59999999999997, 142, 1596, 150.0, 1580.4, 1596.0, 1596.0, 0.09708675024757121, 11.670522662474676, 0.05596393793567679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 294.93333333333334, 135, 862, 144.0, 847.6, 862.0, 862.0, 0.09708675024757121, 3.8289092789043435, 0.056058749215215434], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 40.0, 0.2976190476190476], "isController": false}, {"data": ["401/Unauthorized", 6, 60.0, 0.44642857142857145], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1344, 10, "401/Unauthorized", 6, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

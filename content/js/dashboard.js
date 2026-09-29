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

    var data = {"OkPercent": 99.44576405384007, "KoPercent": 0.5542359461599367};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7413087934560327, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e613b9b-894c-4d5a-9bcb-86aa607c7c26"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/57c9f3e7-e701-4959-a3cd-8829958dd052"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e20c2e9-62a7-4c39-b018-980afebd9e8b"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0b82d37-86b9-4212-9f72-2e55103de43d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2737eda-866e-4e09-ba5a-f26da18a23c4"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff542257-333e-40d8-83b7-6f62ecf9caf8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6a4ac96d-c3a7-4b09-ae9b-7ef6ab46fddd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d6ad4963-0d49-4f3f-824b-1e033a7dd42b"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d5c53d0-3b9a-4a5b-b042-fec4c4eaf311"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a63b0449-5fe5-4ba5-a22a-40511d384f4f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a4ac96d-c3a7-4b09-ae9b-7ef6ab46fddd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a628a1e-ae6e-40f6-9839-ddf8fa1d14f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e61de405-b178-4722-a1a2-6887a8c13d8e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67ea87ed-342d-4551-b97b-94a87663a20e"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/713ce6d9-b178-42dd-a3bb-f3faf5bad3c4"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57c9f3e7-e701-4959-a3cd-8829958dd052"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3e20c2e9-62a7-4c39-b018-980afebd9e8b"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=968e3397-c6ff-4b06-aa12-272925eb7719"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2737eda-866e-4e09-ba5a-f26da18a23c4"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d5c53d0-3b9a-4a5b-b042-fec4c4eaf311"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c32c629-9a0c-4c4e-bf1c-51e9cf6c4094"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.42592592592592593, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9447674418604651, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a63b0449-5fe5-4ba5-a22a-40511d384f4f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1efab506-7731-4467-9efe-15f56dfba4e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a628a1e-ae6e-40f6-9839-ddf8fa1d14f0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e61de405-b178-4722-a1a2-6887a8c13d8e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/968e3397-c6ff-4b06-aa12-272925eb7719"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0b82d37-86b9-4212-9f72-2e55103de43d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/67ea87ed-342d-4551-b97b-94a87663a20e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e613b9b-894c-4d5a-9bcb-86aa607c7c26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1263, 7, 0.5542359461599367, 487.7901821060964, 132, 4344, 167.0, 1313.6000000000008, 1589.1999999999998, 2216.9999999999973, 5.1195784353465745, 721.0252837454399, 3.733774099361573], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2268.3888888888887, 1635, 3815, 2210.0, 2795.0, 2875.5, 3815.0, 0.2457170159033513, 295.6796846560531, 1.2081886475325918], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e613b9b-894c-4d5a-9bcb-86aa607c7c26", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57c9f3e7-e701-4959-a3cd-8829958dd052", 3, 0, 0.0, 493.3333333333333, 279, 646, 555.0, 646.0, 646.0, 646.0, 0.05843055528504373, 0.03756521702082075, 0.03747011520557817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e20c2e9-62a7-4c39-b018-980afebd9e8b", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 769.2499999999999, 459, 1310, 632.0, 1257.8000000000002, 1310.0, 1310.0, 0.07758002055870546, 0.014015921682969246, 0.05273017022349511], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 769.2499999999999, 459, 1310, 632.0, 1257.8000000000002, 1310.0, 1310.0, 0.07656674706175108, 0.01383285957658589, 0.05204146089353394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 138.06666666666663, 132, 144, 139.0, 143.4, 144.0, 144.0, 0.09711943748421809, 0.04543621600010359, 0.05430089382255631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 140.4666666666667, 134, 147, 142.0, 145.8, 147.0, 147.0, 0.09711189232233379, 0.07217006841532814, 0.04874561782585895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 383.6666666666667, 134, 1151, 405.0, 1129.4, 1151.0, 1151.0, 0.09711503599730668, 3.8300248128916974, 0.056075081657559436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 334.0, 132, 1527, 137.0, 1462.2, 1527.0, 1527.0, 0.09711566475672526, 11.673998393545045, 0.05598060519245087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0b82d37-86b9-4212-9f72-2e55103de43d", 1, 0, 0.0, 725.0, 725, 725, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 0.2491918103448276, 0.950969827586207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2737eda-866e-4e09-ba5a-f26da18a23c4", 3, 0, 0.0, 469.3333333333333, 395, 565, 448.0, 565.0, 565.0, 565.0, 0.018773231874444626, 0.0221893245234728, 0.012038823825734346], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 510.3076923076923, 233, 3021, 274.0, 1984.599999999999, 3021.0, 3021.0, 0.07006273309332356, 0.1643621613410007, 0.0452944622146291], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ff542257-333e-40d8-83b7-6f62ecf9caf8", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 160.5, 133, 418, 139.0, 269.60000000000014, 418.0, 418.0, 0.08526693881031304, 0.06336732464321115, 0.042800006395020414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 137.93749999999997, 132, 147, 137.5, 146.3, 147.0, 147.0, 0.0852678476263563, 0.03082008017842297, 0.0481817464187504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1063.0, 830, 1222, 1137.0, 1222.0, 1222.0, 1222.0, 0.0513294322964788, 15.092557392721487, 0.029273816856585567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1531.3333333333333, 1471, 1625, 1498.0, 1625.0, 1625.0, 1625.0, 0.0509044015339193, 45.80386998061391, 0.028981705170190383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 141.66666666666666, 139, 143, 143.0, 143.0, 143.0, 143.0, 0.05221750330710854, 0.09240050389890692, 0.028913402710088423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a4ac96d-c3a7-4b09-ae9b-7ef6ab46fddd", 3, 0, 0.0, 919.6666666666666, 238, 2163, 358.0, 2163.0, 2163.0, 2163.0, 0.024577069594068735, 0.02464907272764511, 0.015760685905050587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 161.20000000000002, 135, 425, 143.0, 259.4000000000001, 425.0, 425.0, 0.0784937571298496, 0.05833373942950737, 0.039400186684319036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 197.0, 134, 433, 143.0, 424.0, 433.0, 433.0, 0.07849211415893084, 0.021002772733932664, 0.04476503385626524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 213.2, 134, 431, 141.0, 422.0, 431.0, 431.0, 0.07838260115274678, 0.021126560466951282, 0.04608039638081403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 237.4, 137, 438, 145.0, 436.2, 438.0, 438.0, 0.07837318174218358, 0.02112402164144792, 0.046151395107946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 140.66666666666666, 137, 143, 142.0, 143.0, 143.0, 143.0, 0.052223866306902254, 0.03881090064409435, 0.029324924928192185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6ad4963-0d49-4f3f-824b-1e033a7dd42b", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.5702427455357142, 1.0654994419642856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 989.1249999999999, 134, 1742, 1289.5, 1632.8000000000002, 1742.0, 1742.0, 0.07939225230857784, 44.6563296248468, 0.04240972852811726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 239.12500000000003, 132, 1458, 136.5, 747.5000000000007, 1458.0, 1458.0, 0.08526921088674651, 4.816882912383221, 0.04967098075580497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d5c53d0-3b9a-4a5b-b042-fec4c4eaf311", 3, 0, 0.0, 331.6666666666667, 239, 493, 263.0, 493.0, 493.0, 493.0, 0.035007059757051005, 0.02918394532480717, 0.02244918871139013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 754.9375, 134, 1228, 948.0, 1221.7, 1228.0, 1228.0, 0.07939579797739205, 14.598650364476336, 0.042489157511338714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 253.06249999999997, 134, 1131, 140.5, 633.3000000000005, 1131.0, 1131.0, 0.08526603001364257, 1.5884857385903395, 0.0497523954425307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a63b0449-5fe5-4ba5-a22a-40511d384f4f", 3, 0, 0.0, 666.3333333333334, 251, 1234, 514.0, 1234.0, 1234.0, 1234.0, 0.030417634116418426, 0.030506748278868873, 0.019506100003041763], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 598.25, 243, 1593, 517.0, 1332.6000000000008, 1593.0, 1593.0, 0.07609867461475046, 0.013748295706766441, 0.052466469021497875], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 420.4, 279, 855, 292.0, 691.8000000000001, 855.0, 855.0, 0.07831753059604861, 0.12137687603118083, 0.1761379618776367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 681.4499999999999, 186, 1484, 515.5, 1238.6000000000004, 1472.4499999999998, 1484.0, 0.09062444775727148, 0.05566677503840211, 0.04097570245275068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 176.9375, 135, 426, 141.5, 419.7, 426.0, 426.0, 0.07950152543551929, 0.059082676617607605, 0.0399060391346259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 245.6875, 135, 439, 146.5, 432.0, 439.0, 439.0, 0.07950113040669797, 0.09590212044421256, 0.04116745546694492], "isController": false}, {"data": ["login", 20, 0, 0.0, 3235.5499999999997, 1473, 5279, 2934.0, 5165.400000000001, 5273.95, 5279.0, 0.08993614533681087, 16.26543933104371, 0.1580645319947837], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 146.75, 137, 164, 146.0, 164.0, 164.0, 164.0, 0.08606083425221203, 0.069672296479574, 0.030591937175590996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a4ac96d-c3a7-4b09-ae9b-7ef6ab46fddd", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a628a1e-ae6e-40f6-9839-ddf8fa1d14f0", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.5593314628482972, 2.13452979876161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e61de405-b178-4722-a1a2-6887a8c13d8e", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67ea87ed-342d-4551-b97b-94a87663a20e", 1, 0, 0.0, 1593.0, 1593, 1593, 1593.0, 1593.0, 1593.0, 1593.0, 0.6277463904582549, 0.11341121311989956, 0.432801710608914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1169.375, 278, 1898, 1428.0, 1785.3000000000002, 1898.0, 1898.0, 0.07933753161104774, 59.36815287660535, 0.16574493603411514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 572.6, 274, 1664, 556.0, 1602.8, 1664.0, 1664.0, 0.09702395197961204, 15.606902758956927, 0.2148992103058842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1672.3333333333333, 1614, 1768, 1635.0, 1768.0, 1768.0, 1768.0, 0.05078634185979584, 60.75812105347802, 0.11451724936940293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/713ce6d9-b178-42dd-a3bb-f3faf5bad3c4", 2, 0, 0.0, 1672.0, 323, 3021, 1672.0, 3021.0, 3021.0, 3021.0, 0.010289177328826674, 0.020347250088744155, 0.006395567743943533], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1329.9545454545455, 442, 2423, 1310.0, 2114.0, 2387.4499999999994, 2423.0, 0.08860713609653345, 0.02802011885439028, 0.03997704773105318], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 454.8125, 270, 1876, 285.0, 968.1000000000009, 1876.0, 1876.0, 0.0852029160698025, 6.4945641954049, 0.19026085738096885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 168.7142857142857, 138, 418, 147.0, 304.0, 418.0, 418.0, 0.09564278785063329, 0.07425392220825534, 0.033998022243779805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 570.8499999999999, 272, 1642, 548.5, 850.1, 1602.4499999999994, 1642.0, 0.12626023497029729, 7.7384515780162, 0.28234698443211304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 139.4, 134, 152, 138.0, 151.2, 152.0, 152.0, 0.049585957256904845, 0.03685050143799276, 0.024889826201219815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57c9f3e7-e701-4959-a3cd-8829958dd052", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 136.2, 132, 140, 136.5, 140.0, 140.0, 140.0, 0.04958472790380563, 0.01326778852113549, 0.028278790132639144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 169.29999999999998, 135, 427, 141.0, 398.7000000000001, 427.0, 427.0, 0.049514510227222086, 0.013345707834680953, 0.02910911636405048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 139.0, 134, 146, 139.0, 145.7, 146.0, 146.0, 0.04958546550835019, 0.013364832500297514, 0.029199253614780436], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1538.0555555555557, 1064, 3250, 1402.0, 2216.0, 2307.25, 3250.0, 0.24445893089960888, 292.4578690311278, 0.48271089675684486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e20c2e9-62a7-4c39-b018-980afebd9e8b", 3, 0, 0.0, 417.0, 255, 566, 430.0, 566.0, 566.0, 566.0, 0.022887659736791913, 0.022954713427427047, 0.01467730783902346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1329.9545454545455, 442, 2423, 1310.0, 2114.0, 2387.4499999999994, 2423.0, 0.09049178170091644, 0.02861609787097517, 0.04082734682209316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 140.7142857142857, 139, 145, 140.0, 145.0, 145.0, 145.0, 0.04452586316566165, 0.012001111556369744, 0.026219819813373027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 180.0, 133, 422, 140.0, 422.0, 422.0, 422.0, 0.044526146389247574, 0.012001187893976884, 0.026176504029616247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 425.8571428571429, 135, 1554, 141.0, 1455.0, 1554.0, 1554.0, 0.09174251806999954, 17.708731379135784, 0.05224511143439427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 341.3571428571429, 136, 1260, 140.0, 1057.5, 1260.0, 1260.0, 0.09174251806999954, 5.799860113138184, 0.052334703737197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 179.42857142857144, 135, 418, 139.0, 418.0, 418.0, 418.0, 0.0445275625612254, 0.01191460170095289, 0.025394625523198863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 162.21428571428572, 137, 431, 141.5, 289.0, 431.0, 431.0, 0.09174011336456865, 0.06817795534222339, 0.046049236591199506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 139.57142857142856, 134, 142, 140.0, 142.0, 142.0, 142.0, 0.04452671284722885, 0.033090652809317535, 0.022350322659644168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 240.2142857142857, 134, 434, 142.0, 429.5, 434.0, 434.0, 0.09174432168180448, 0.054076417285940835, 0.05067184284853012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=968e3397-c6ff-4b06-aa12-272925eb7719", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 146.0, 142, 151, 147.0, 151.0, 151.0, 151.0, 0.04283493862365223, 0.03371578176822627, 0.015226482088876378], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 847.1666666666667, 448, 2163, 560.5, 2049.9000000000005, 2163.0, 2163.0, 0.07296385249141155, 0.013181946006749157, 0.04966387225245493], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1896.5499999999997, 782, 4344, 1628.0, 3576.9000000000024, 4311.95, 4344.0, 0.08963947005145306, 0.046395428835224725, 0.04123065468186952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 323.0, 280, 565, 282.0, 565.0, 565.0, 565.0, 0.04448653011420328, 0.06894543290160215, 0.10005124887989272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2737eda-866e-4e09-ba5a-f26da18a23c4", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["addBook", 59, 2, 3.389830508474576, 1549.2372881355934, 720, 3363, 1266.0, 2453.0, 2608.0, 3363.0, 0.2798131417324702, 97.49504343180148, 1.0165410990372532], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d5c53d0-3b9a-4a5b-b042-fec4c4eaf311", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 288.3518518518519, 134, 1891, 146.0, 568.5, 581.75, 1891.0, 0.24592627676725354, 0.1827635709178515, 0.11888037792948292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c32c629-9a0c-4c4e-bf1c-51e9cf6c4094", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 906.3148148148148, 658, 1410, 836.0, 1149.0, 1294.75, 1410.0, 0.24513920729243746, 72.07906633171875, 0.1232877849175833], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 240.62962962962965, 132, 649, 144.0, 422.0, 466.0, 649.0, 0.24588596355423606, 0.4351028964455818, 0.11958125961914996], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1243.0555555555557, 918, 1732, 1220.5, 1616.5, 1713.25, 1732.0, 0.24528173332424885, 220.70493480445595, 0.12311993254752333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 197.6, 136, 932, 144.0, 398.1000000000006, 906.6499999999996, 932.0, 0.12584869211746716, 0.09401782174791248, 0.04473527727613091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 2, 1.1627906976744187, 260.5232558139536, 134, 2796, 149.0, 446.9000000000001, 629.5999999999999, 2013.440000000011, 0.7416094650063814, 1.5472457373624573, 0.3590486594977752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 147.2, 141, 167, 144.5, 165.4, 167.0, 167.0, 0.05166036410224619, 0.04000651243464964, 0.018363645051970325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a63b0449-5fe5-4ba5-a22a-40511d384f4f", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1efab506-7731-4467-9efe-15f56dfba4e0", 1, 0, 0.0, 894.0, 894, 894, 894.0, 894.0, 894.0, 894.0, 1.1185682326621924, 0.3571990352348993, 0.6674269435123042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 166.86666666666667, 136, 438, 146.0, 284.4000000000001, 438.0, 438.0, 0.09779441007152032, 0.07936245582952478, 0.034762856705110735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a628a1e-ae6e-40f6-9839-ddf8fa1d14f0", 3, 0, 0.0, 414.0, 338, 495, 409.0, 495.0, 495.0, 495.0, 0.05604229325063982, 0.025977938017223666, 0.03593857998169285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 310.29999999999995, 275, 571, 280.5, 543.3000000000001, 571.0, 571.0, 0.049481189725725766, 0.07668617978000662, 0.11128435540854144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e61de405-b178-4722-a1a2-6887a8c13d8e", 3, 0, 0.0, 386.3333333333333, 239, 600, 320.0, 600.0, 600.0, 600.0, 0.07513524343818874, 0.03399674100881587, 0.048182431501703066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/968e3397-c6ff-4b06-aa12-272925eb7719", 3, 0, 0.0, 708.3333333333334, 385, 1093, 647.0, 1093.0, 1093.0, 1093.0, 0.015940234746523698, 0.021974900439950477, 0.01022209064148818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 674.3571428571428, 282, 1985, 563.5, 1743.0, 1985.0, 1985.0, 0.09165482791806058, 23.608259542331435, 0.20110869607913737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0b82d37-86b9-4212-9f72-2e55103de43d", 3, 0, 0.0, 646.6666666666667, 253, 1413, 274.0, 1413.0, 1413.0, 1413.0, 0.024193938611913095, 0.028596416373651186, 0.015514993185373957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 174.4, 138, 436, 149.0, 331.00000000000006, 436.0, 436.0, 0.08012007328316037, 0.06642767794668276, 0.02848018229987341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67ea87ed-342d-4551-b97b-94a87663a20e", 3, 0, 0.0, 784.0, 233, 1786, 333.0, 1786.0, 1786.0, 1786.0, 0.02199590876097046, 0.026127301780202214, 0.01410544930309629], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 165.875, 136, 402, 143.0, 301.2000000000001, 402.0, 402.0, 0.07946204197582367, 0.06169172204177716, 0.02824627273359357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e613b9b-894c-4d5a-9bcb-86aa607c7c26", 3, 0, 0.0, 320.6666666666667, 235, 486, 241.0, 486.0, 486.0, 486.0, 0.0715068884969252, 0.04448231247318492, 0.045855654407207895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 182.29999999999995, 135, 425, 141.0, 421.1, 424.85, 425.0, 0.1266031119044906, 0.09408688296808336, 0.06354882765518377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 264.15, 135, 445, 149.0, 427.6, 444.15, 445.0, 0.12659990631606935, 0.043382721803035866, 0.0716698883705326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 342.55, 135, 1495, 398.5, 424.8, 1441.499999999999, 1495.0, 0.12662635727626706, 5.729354215470575, 0.07389835069169648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 243.79999999999998, 133, 1144, 140.0, 420.0, 1107.8499999999995, 1144.0, 0.1268335373239392, 1.8971398839156048, 0.07414312054893554], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 71.42857142857143, 0.39588281868566905], "isController": false}, {"data": ["401/Unauthorized", 2, 28.571428571428573, 0.1583531274742676], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1263, 7, "406/Not Acceptable", 5, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

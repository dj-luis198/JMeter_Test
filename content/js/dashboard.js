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

    var data = {"OkPercent": 99.22958397534669, "KoPercent": 0.7704160246533128};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7382528127068166, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6514e725-b33f-469e-b8e7-26a9326a94e1"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfb95184-00c1-429b-94ba-96ed99c69258"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d47330b8-1abe-4446-bd30-be71034aedce"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ea12d3cf-12ef-444a-bee7-d58a5880aa7e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7407a1e2-f5aa-44c8-80ac-21bda1283ea3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c03fd77f-25c6-45ab-990e-622a51bbef1c"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e8c0bf7-9041-4299-b293-bb65709df0e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1e7aa10f-3481-44b4-a719-dc91f5443524"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e3fcef0-2ccb-4231-83d6-26f4472c7336"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e7bd2ce-e6d3-448f-8228-f83b6572b389"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42f8497d-2219-443d-bea6-f78ebfd2413b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bfb95184-00c1-429b-94ba-96ed99c69258"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/233a4fd8-4402-4871-bc76-de838bd418d1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59621ab2-aa9a-4f4b-bd06-58b7f798e747"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7559ccf0-4e27-418b-a481-fb43057d1ce1"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=233a4fd8-4402-4871-bc76-de838bd418d1"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/42f8497d-2219-443d-bea6-f78ebfd2413b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e7bd2ce-e6d3-448f-8228-f83b6572b389"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e22b9bf-45cc-4cda-9b30-677d17d432d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e7aa10f-3481-44b4-a719-dc91f5443524"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7407a1e2-f5aa-44c8-80ac-21bda1283ea3"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e8c0bf7-9041-4299-b293-bb65709df0e0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea12d3cf-12ef-444a-bee7-d58a5880aa7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c03fd77f-25c6-45ab-990e-622a51bbef1c"], "isController": false}, {"data": [0.3125, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9437869822485208, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e3fcef0-2ccb-4231-83d6-26f4472c7336"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d47330b8-1abe-4446-bd30-be71034aedce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e22b9bf-45cc-4cda-9b30-677d17d432d8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59621ab2-aa9a-4f4b-bd06-58b7f798e747"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6514e725-b33f-469e-b8e7-26a9326a94e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 10, 0.7704160246533128, 493.43990755007684, 140, 3358, 163.0, 1391.6000000000008, 1684.1499999999999, 2189.13, 5.016948628455916, 724.6166636530671, 3.6717750499569037], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2312.385964912281, 1720, 3303, 2280.0, 2792.2000000000003, 2994.6, 3303.0, 0.25449723401690394, 306.2457854127878, 1.251360911401476], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6514e725-b33f-469e-b8e7-26a9326a94e1", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 739.7857142857142, 456, 2383, 569.0, 1701.5, 2383.0, 2383.0, 0.07284079084287201, 0.013159713189386057, 0.04950897502601457], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 739.7857142857142, 456, 2383, 569.0, 1701.5, 2383.0, 2383.0, 0.07079681818871399, 0.012790440786046959, 0.04811971236264153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfb95184-00c1-429b-94ba-96ed99c69258", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 191.6111111111111, 141, 439, 143.5, 429.1, 439.0, 439.0, 0.10847947929849937, 0.03807846305671066, 0.06136105963358042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 163.22222222222223, 141, 427, 145.0, 192.10000000000036, 427.0, 427.0, 0.10867202782003912, 0.08076114567485329, 0.054548263964355574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 278.0555555555556, 141, 859, 143.5, 489.1000000000006, 859.0, 859.0, 0.10848928668294006, 1.7998085427779285, 0.0633678201187355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 287.77777777777777, 141, 1620, 143.0, 545.4000000000017, 1620.0, 1620.0, 0.10867399612396081, 5.460166688175061, 0.06336958063912385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d47330b8-1abe-4446-bd30-be71034aedce", 1, 0, 0.0, 1582.0, 1582, 1582, 1582.0, 1582.0, 1582.0, 1582.0, 0.6321112515802781, 0.11419978666245259, 0.4358110777496839], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 280.50000000000006, 232, 450, 262.0, 389.0, 450.0, 450.0, 0.07266046284714835, 0.16876730551648614, 0.046973853910949416], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ea12d3cf-12ef-444a-bee7-d58a5880aa7e", 3, 0, 0.0, 1133.0, 243, 2828, 328.0, 2828.0, 2828.0, 2828.0, 0.04609286175214332, 0.02867300091417509, 0.029558247933503364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7407a1e2-f5aa-44c8-80ac-21bda1283ea3", 1, 0, 0.0, 1898.0, 1898, 1898, 1898.0, 1898.0, 1898.0, 1898.0, 0.5268703898840885, 0.09518654504741834, 0.36325243677555324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 146.94117647058826, 142, 173, 143.0, 158.6, 173.0, 173.0, 0.105491123232248, 0.07839721169896556, 0.05295159896618699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 227.41176470588235, 141, 433, 146.0, 425.8, 433.0, 433.0, 0.10548785028171462, 0.04686598311573879, 0.05911876535778997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 974.8333333333333, 836, 1338, 853.5, 1338.0, 1338.0, 1338.0, 0.20696078093201337, 60.853341338691315, 0.11803232037528888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c03fd77f-25c6-45ab-990e-622a51bbef1c", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.31807053257042256, 1.2138259242957747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1482.5, 1343, 1546, 1534.5, 1546.0, 1546.0, 1546.0, 0.20541613886130985, 184.8338028304632, 0.11695078999623404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 429.83333333333337, 423, 442, 425.0, 442.0, 442.0, 442.0, 0.21196919381049956, 0.3750861124849855, 0.1173696610259309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e8c0bf7-9041-4299-b293-bb65709df0e0", 3, 0, 0.0, 340.6666666666667, 237, 483, 302.0, 483.0, 483.0, 483.0, 0.03283065945851299, 0.02110695066099061, 0.02105351534286152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 168.75, 142, 425, 144.0, 343.7000000000003, 425.0, 425.0, 0.06995208282326607, 0.05198587405127488, 0.035112666573397226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 213.83333333333331, 141, 425, 144.5, 425.0, 425.0, 425.0, 0.0699557529862362, 0.02747448436780403, 0.03940704119227922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e7aa10f-3481-44b4-a719-dc91f5443524", 3, 0, 0.0, 510.3333333333333, 261, 657, 613.0, 657.0, 657.0, 657.0, 0.019316579420116286, 0.026616888243929767, 0.012387259589071968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 377.4166666666667, 142, 1642, 145.5, 1327.6000000000013, 1642.0, 1642.0, 0.0699553451713323, 5.262779101787942, 0.04062510930522683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 226.0, 141, 1129, 143.0, 835.000000000001, 1129.0, 1129.0, 0.06995289838175629, 1.7313228493855803, 0.040692001760481274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 240.0, 143, 427, 149.5, 427.0, 427.0, 427.0, 0.2120665889089174, 0.1576002677340685, 0.11908035998303468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 1306.0000000000002, 143, 1966, 1587.0, 1913.2, 1966.0, 1966.0, 0.15194548663464122, 105.17930937123789, 0.07928285382844186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 295.4117647058824, 142, 1320, 144.0, 1278.3999999999999, 1320.0, 1320.0, 0.105491123232248, 11.19227609121259, 0.06095069608627932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 891.6153846153845, 141, 1343, 1120.0, 1311.3999999999999, 1343.0, 1343.0, 0.1519472626116228, 34.3767897634298, 0.0794321665049792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 284.3529411764706, 141, 1130, 143.0, 1121.2, 1130.0, 1130.0, 0.105491123232248, 3.6742519438290793, 0.061053714761310815], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 734.0, 231, 1898, 507.0, 1740.0, 1898.0, 1898.0, 0.07100435662445288, 0.012827935522972445, 0.04895417556334349], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 571.5833333333334, 285, 1784, 434.5, 1554.500000000001, 1784.0, 1784.0, 0.06989137715134396, 7.067156922522496, 0.1556971482862052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 643.2857142857143, 178, 1435, 515.0, 1347.0, 1427.3999999999999, 1435.0, 0.09586502204895507, 0.05888583873905541, 0.04334521993033809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 146.69230769230768, 141, 163, 144.0, 158.6, 163.0, 163.0, 0.15192950470981464, 0.11290854793375873, 0.07626148966879367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 230.3076923076923, 142, 427, 144.0, 426.2, 427.0, 427.0, 0.1519472626116228, 0.21620981433213335, 0.07684111868250035], "isController": false}, {"data": ["login", 21, 0, 0.0, 3199.761904761905, 1612, 5098, 3051.0, 4372.8, 5025.499999999999, 5098.0, 0.0946790380609733, 32.49134151743447, 0.18770700472718913], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 201.94117647058826, 145, 467, 150.0, 436.59999999999997, 467.0, 467.0, 0.09922082470014883, 0.0803262340590072, 0.03526990253013103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e3fcef0-2ccb-4231-83d6-26f4472c7336", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1454.2307692307693, 286, 2111, 1740.0, 2058.2, 2111.0, 2111.0, 0.15167248077842985, 139.6334890103079, 0.3112635593739427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e7bd2ce-e6d3-448f-8228-f83b6572b389", 3, 0, 0.0, 472.3333333333333, 235, 691, 491.0, 691.0, 691.0, 691.0, 0.019595547891519047, 0.023161274216831267, 0.01256615538616293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42f8497d-2219-443d-bea6-f78ebfd2413b", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfb95184-00c1-429b-94ba-96ed99c69258", 3, 0, 0.0, 437.6666666666667, 279, 570, 464.0, 570.0, 570.0, 570.0, 0.04779200917606576, 0.03128571954852482, 0.030647870467724464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/233a4fd8-4402-4871-bc76-de838bd418d1", 3, 0, 0.0, 337.0, 258, 490, 263.0, 490.0, 490.0, 490.0, 0.07289161017566878, 0.032981555385475134, 0.0467436432441626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 517.2222222222222, 286, 1786, 439.5, 946.3000000000013, 1786.0, 1786.0, 0.10838411329752642, 7.362257857471881, 0.24221779486500158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 1723.3333333333335, 1498, 1966, 1684.5, 1966.0, 1966.0, 1966.0, 0.20244964065188784, 242.20015310254075, 0.4565002151027432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59621ab2-aa9a-4f4b-bd06-58b7f798e747", 1, 0, 0.0, 948.0, 948, 948, 948.0, 948.0, 948.0, 948.0, 1.0548523206751055, 0.1905739055907173, 0.7272712289029536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7559ccf0-4e27-418b-a481-fb43057d1ce1", 1, 0, 0.0, 1468.0, 1468, 1468, 1468.0, 1468.0, 1468.0, 1468.0, 0.6811989100817438, 0.2175312925749319, 0.40645755279291557], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1165.9999999999998, 171, 2294, 1106.0, 2069.6000000000004, 2275.6, 2294.0, 0.09071260668591351, 0.02857878488491331, 0.040926976844621134], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=233a4fd8-4402-4871-bc76-de838bd418d1", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 520.5294117647059, 286, 1494, 306.0, 1428.3999999999999, 1494.0, 1494.0, 0.10539367637941724, 14.977944096791692, 0.23386038243955362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 198.41666666666669, 144, 453, 150.0, 450.90000000000003, 453.0, 453.0, 0.09018149024912636, 0.07001394994927292, 0.032056701611994136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42f8497d-2219-443d-bea6-f78ebfd2413b", 3, 0, 0.0, 971.6666666666666, 260, 2157, 498.0, 2157.0, 2157.0, 2157.0, 0.03905334687182692, 0.03255716840454061, 0.025043975695800465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e7bd2ce-e6d3-448f-8228-f83b6572b389", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e22b9bf-45cc-4cda-9b30-677d17d432d8", 1, 0, 0.0, 1253.0, 1253, 1253, 1253.0, 1253.0, 1253.0, 1253.0, 0.7980845969672786, 0.14418520550678374, 0.5502419193934558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e7aa10f-3481-44b4-a719-dc91f5443524", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7407a1e2-f5aa-44c8-80ac-21bda1283ea3", 3, 0, 0.0, 547.3333333333334, 272, 966, 404.0, 966.0, 966.0, 966.0, 0.017573971776201326, 0.024227138825590046, 0.011269767057004106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 517.1176470588234, 287, 2118, 299.0, 900.399999999999, 2118.0, 2118.0, 0.11762345273266957, 8.44913153242602, 0.26276760416594597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 171.9090909090909, 141, 443, 144.0, 384.6000000000002, 443.0, 443.0, 0.051311953352769675, 0.03813319970845481, 0.02575619533527697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 194.27272727272728, 140, 425, 143.0, 424.4, 425.0, 425.0, 0.05131219270993684, 0.013730020314963568, 0.029263984904885854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 195.0, 141, 432, 143.0, 429.6, 432.0, 432.0, 0.05131267143097046, 0.013830368471628756, 0.030166238477972868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 142.45454545454547, 141, 147, 142.0, 146.2, 147.0, 147.0, 0.05131243206933709, 0.013830303956188512, 0.03021620755645534], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1598.1052631578948, 1127, 2714, 1544.0, 2184.2, 2379.3999999999996, 2714.0, 0.2638388083743363, 315.64294002643015, 0.5209785845047931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1165.9999999999998, 171, 2294, 1106.0, 2069.6000000000004, 2275.6, 2294.0, 0.08889816521917263, 0.02800714953830931, 0.0401083518859939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 168.3076923076923, 141, 443, 143.0, 327.39999999999986, 443.0, 443.0, 0.05940711697261332, 0.016012074496524684, 0.034982901889146316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 145.46153846153848, 141, 152, 144.0, 152.0, 152.0, 152.0, 0.05948867198403873, 0.01603405612069794, 0.03497283255311652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e8c0bf7-9041-4299-b293-bb65709df0e0", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea12d3cf-12ef-444a-bee7-d58a5880aa7e", 1, 0, 0.0, 748.0, 748, 748, 748.0, 748.0, 748.0, 748.0, 1.3368983957219251, 0.2415294953208556, 0.9217287767379679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 191.66666666666669, 140, 425, 147.0, 424.4, 425.0, 425.0, 0.09471640330244527, 0.0255290305776122, 0.05568288553522661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 237.33333333333334, 140, 424, 149.0, 423.7, 424.0, 424.0, 0.09471490812653911, 0.025528627580981247, 0.05577450156279599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 143.84615384615387, 140, 153, 143.0, 151.4, 153.0, 153.0, 0.05948921643549767, 0.015918012991529652, 0.03392744374836977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 148.75, 140, 157, 150.0, 155.5, 157.0, 157.0, 0.09471266545118746, 0.07038704922690787, 0.04754131840030308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 145.76923076923075, 142, 152, 144.0, 151.6, 152.0, 152.0, 0.05948758311101755, 0.0442090339330902, 0.029859978241272487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 167.66666666666666, 141, 425, 144.5, 341.9000000000003, 425.0, 425.0, 0.09471864615481762, 0.02534463774064456, 0.05401922788516943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 174.46153846153845, 146, 429, 153.0, 324.19999999999993, 429.0, 429.0, 0.06135664256451887, 0.04829438858105684, 0.021810369036606315], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 822.9285714285714, 456, 2828, 541.0, 2189.0, 2828.0, 2828.0, 0.07316129976274835, 0.013217617632918404, 0.04979826751429258], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1656.095238095238, 999, 3358, 1373.0, 3292.0, 3357.7, 3358.0, 0.0947204618750141, 0.049025239056403776, 0.04356771244446449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 317.7692307692308, 285, 586, 297.0, 475.19999999999993, 586.0, 586.0, 0.05936696548039292, 0.09200720138416363, 0.13351769677865713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c03fd77f-25c6-45ab-990e-622a51bbef1c", 3, 0, 0.0, 469.6666666666667, 443, 516, 450.0, 516.0, 516.0, 516.0, 0.01741654571843251, 0.024010114296081277, 0.011168813497822932], "isController": false}, {"data": ["addBook", 56, 4, 7.142857142857143, 1486.2857142857142, 721, 3231, 1175.0, 2618.1, 2880.1999999999994, 3231.0, 0.25949472669644674, 84.16817169746622, 0.9432703908986858], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 247.56140350877203, 142, 624, 147.0, 571.2, 591.1999999999999, 624.0, 0.265557227582544, 0.19735258807648048, 0.1283699488802337], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 939.3684210526314, 698, 1399, 847.0, 1272.4, 1317.2, 1399.0, 0.2654360369002659, 78.04700815459087, 0.13349566308948918], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 235.87719298245614, 142, 451, 148.0, 428.4, 441.29999999999995, 451.0, 0.2661375043772616, 0.47093863079257614, 0.12943015349597292], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1343.0000000000002, 979, 2129, 1273.0, 1694.6000000000001, 1778.4999999999995, 2129.0, 0.26460675722097915, 238.09362527650248, 0.1328201886831868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 166.11764705882356, 144, 428, 152.0, 213.5999999999998, 428.0, 428.0, 0.12105761630432461, 0.09043855124297688, 0.043032199545677885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 4, 2.366863905325444, 228.07692307692298, 142, 1043, 151.0, 414.0, 541.5, 917.000000000002, 0.7133540726608106, 1.586732174854058, 0.341091377649224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 148.0909090909091, 144, 157, 146.0, 156.0, 157.0, 157.0, 0.05349231898928695, 0.0414252040610396, 0.019014847765723094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 150.44444444444446, 143, 174, 147.0, 174.0, 174.0, 174.0, 0.10413713703868693, 0.0845097274210438, 0.03701749793172075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e3fcef0-2ccb-4231-83d6-26f4472c7336", 3, 0, 0.0, 491.0, 318, 814, 341.0, 814.0, 814.0, 814.0, 0.06826870562534133, 0.030889811464591296, 0.04377908531312579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 393.3636363636364, 285, 875, 290.0, 813.0000000000002, 875.0, 875.0, 0.05127750921829768, 0.0794701241498422, 0.11532432004857378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 412.16666666666663, 286, 582, 302.0, 580.2, 582.0, 582.0, 0.09460215850591658, 0.14661486870008753, 0.21276247171789636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d47330b8-1abe-4446-bd30-be71034aedce", 3, 0, 0.0, 685.3333333333333, 249, 1550, 257.0, 1550.0, 1550.0, 1550.0, 0.023149755770076625, 0.02321757732018427, 0.014845383745784814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 176.24999999999997, 147, 427, 151.0, 351.10000000000025, 427.0, 427.0, 0.06837528917049378, 0.056690059087645725, 0.024305278572323962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e22b9bf-45cc-4cda-9b30-677d17d432d8", 3, 0, 0.0, 315.0, 232, 456, 257.0, 456.0, 456.0, 456.0, 0.021245255226332787, 0.025111172437114044, 0.013624073175740752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59621ab2-aa9a-4f4b-bd06-58b7f798e747", 3, 0, 0.0, 360.0, 238, 566, 276.0, 566.0, 566.0, 566.0, 0.04018054458031421, 0.025465989680296803, 0.025766820580474935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6514e725-b33f-469e-b8e7-26a9326a94e1", 3, 0, 0.0, 445.0, 244, 786, 305.0, 786.0, 786.0, 786.0, 0.02049768376173492, 0.028257711826480274, 0.01314467350606048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 148.0769230769231, 144, 159, 146.0, 157.0, 159.0, 159.0, 0.14836795252225518, 0.11518801001483679, 0.0527401706231454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 162.1764705882353, 142, 443, 143.0, 209.3999999999998, 443.0, 443.0, 0.11774320898726989, 0.087502521522766, 0.0591015716986882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 194.7058823529412, 140, 434, 145.0, 430.8, 434.0, 434.0, 0.11774076254458565, 0.04190727049208713, 0.06656735897080722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 319.94117647058823, 141, 1675, 144.0, 695.7999999999992, 1675.0, 1675.0, 0.11774320898726989, 6.261959647411034, 0.06862491948442326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 282.94117647058823, 140, 1121, 145.0, 564.9999999999995, 1121.0, 1121.0, 0.11774402449075709, 2.0663778691448322, 0.06874037918770476], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 60.0, 0.4622496147919877], "isController": false}, {"data": ["401/Unauthorized", 4, 40.0, 0.3081664098613251], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 10, "406/Not Acceptable", 6, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

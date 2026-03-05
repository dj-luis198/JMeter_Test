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

    var data = {"OkPercent": 96.57228017883756, "KoPercent": 3.427719821162444};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7271863117870723, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a9dc9b7-40de-40d2-abaf-bfc06e7250a6"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5277777777777778, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce18a916-9a4f-4ca3-8573-39ffd0e2e1ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f350e80-4fe9-4403-ae64-baa111e64527"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8de8b65a-0bf9-4e55-9b59-8799bbeb3b2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/6326381d-53a2-4813-b2ee-7347cc3b14dd"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.82, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=727d60b2-b2c7-4ee9-8c7e-e7873f93b982"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/266bf3ac-f360-407c-96bf-c1d2da6b7eda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a61a8d6-3d05-4a45-8952-ece4b509d1c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fcef437-59ad-404f-bd5b-2c1bdf9cdeef"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d23690e7-f7bb-44f3-a804-8a17d05a1b33"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/16b5ed2e-79c7-4ad3-ac56-74a8a2323ff7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce18a916-9a4f-4ca3-8573-39ffd0e2e1ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7064d765-e3c7-4525-9733-572a70d94b12"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80503015-a11a-4a91-bd68-500157f24e95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb67873f-175f-4790-89ea-fa0d057fa53f"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb67873f-175f-4790-89ea-fa0d057fa53f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8de8b65a-0bf9-4e55-9b59-8799bbeb3b2f"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7f350e80-4fe9-4403-ae64-baa111e64527"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6326381d-53a2-4813-b2ee-7347cc3b14dd"], "isController": false}, {"data": [0.21818181818181817, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.874251497005988, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=266bf3ac-f360-407c-96bf-c1d2da6b7eda"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3fcef437-59ad-404f-bd5b-2c1bdf9cdeef"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16b5ed2e-79c7-4ad3-ac56-74a8a2323ff7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d23690e7-f7bb-44f3-a804-8a17d05a1b33"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a61a8d6-3d05-4a45-8952-ece4b509d1c6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7064d765-e3c7-4525-9733-572a70d94b12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/727d60b2-b2c7-4ee9-8c7e-e7873f93b982"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0a9dc9b7-40de-40d2-abaf-bfc06e7250a6"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1342, 46, 3.427719821162444, 449.98584202682474, 136, 4346, 165.0, 1136.7, 1314.0, 1846.8499999999997, 5.299634712212459, 778.2283889389378, 3.876782474824761], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a9dc9b7-40de-40d2-abaf-bfc06e7250a6", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2101.1403508771937, 1660, 2954, 2064.0, 2467.8, 2626.4999999999995, 2954.0, 0.25899437482392923, 311.6590669898038, 1.273473317615707], "isController": true}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 538.6666666666666, 144, 1313, 481.0, 1191.5000000000002, 1313.0, 1313.0, 0.09821092432848282, 0.020860230509223643, 0.065447308134047], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 538.6666666666666, 144, 1313, 481.0, 1191.5000000000002, 1313.0, 1313.0, 0.10094891984655764, 0.021441787174439734, 0.06727189575061131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 209.14285714285714, 137, 428, 146.0, 423.2, 427.7, 428.0, 0.10310645004492495, 0.03496336652379058, 0.05839054820717523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce18a916-9a4f-4ca3-8573-39ffd0e2e1ea", 3, 0, 0.0, 426.3333333333333, 309, 637, 333.0, 637.0, 637.0, 637.0, 0.04510599909788002, 0.028998811268982107, 0.028925396556908733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 175.47619047619045, 139, 426, 148.0, 376.20000000000016, 426.0, 426.0, 0.10310138794106528, 0.07662124631167058, 0.05175206386885504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 220.71428571428572, 138, 679, 143.0, 424.4, 653.5999999999997, 679.0, 0.10310088175801732, 1.4700409856689776, 0.06029081045884802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 275.90476190476187, 138, 1216, 146.0, 439.8, 1138.4999999999989, 1216.0, 0.10296035536031221, 4.438044257324894, 0.0601080869230543], "isController": false}, {"data": ["goToProfile", 19, 5, 26.31578947368421, 344.9473684210526, 142, 1668, 269.0, 611.0, 1668.0, 1668.0, 0.09740043368824684, 0.14222085324061495, 0.06294282754740582], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f350e80-4fe9-4403-ae64-baa111e64527", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8de8b65a-0bf9-4e55-9b59-8799bbeb3b2f", 3, 0, 0.0, 551.6666666666666, 333, 861, 461.0, 861.0, 861.0, 861.0, 0.031029560828282413, 0.031120467744771518, 0.019898513942616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 178.125, 138, 415, 144.5, 414.3, 415.0, 415.0, 0.09198468455002243, 0.06835971185797564, 0.04617199986202297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 198.93750000000003, 137, 450, 144.0, 435.3, 450.0, 450.0, 0.09198309810572308, 0.03324730877576246, 0.05197628920060939], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 11, 0, 0.0, 946.7272727272726, 684, 1091, 991.0, 1079.8, 1091.0, 1091.0, 0.07399534502011328, 21.75708831260343, 0.04220047020678336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 11, 0, 0.0, 1128.3636363636365, 961, 1278, 1074.0, 1277.8, 1278.0, 1278.0, 0.07371665996515211, 66.33038021671022, 0.0419695437106286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 11, 0, 0.0, 309.90909090909093, 142, 533, 414.0, 515.2, 533.0, 533.0, 0.07413298108935046, 0.1311806266932647, 0.041048242458654016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 192.50000000000003, 140, 445, 145.0, 427.90000000000003, 445.0, 445.0, 0.09011264080100126, 0.06696847622027534, 0.04523232165206508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 176.27777777777777, 136, 429, 147.5, 425.4, 429.0, 429.0, 0.0901167011279607, 0.02411325791900511, 0.05139468111204009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 187.27777777777777, 137, 427, 143.0, 412.6, 427.0, 427.0, 0.09011354306426098, 0.02428841590403909, 0.0529769071530128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 160.1111111111111, 137, 449, 143.0, 179.00000000000043, 449.0, 449.0, 0.09011895702327072, 0.024289875135178437, 0.0530680967627268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 11, 0, 0.0, 225.3636363636364, 138, 447, 148.0, 443.40000000000003, 447.0, 447.0, 0.07412448870949266, 0.05508665616008194, 0.041622637703084255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 1081.4166666666667, 142, 1319, 1269.5, 1307.6000000000001, 1319.0, 1319.0, 0.059519676212961406, 44.63259813616614, 0.03072858283650937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 332.0, 138, 1330, 148.0, 802.2000000000005, 1330.0, 1330.0, 0.09182894563152488, 5.1874442659280176, 0.05349215436445761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 776.4166666666666, 141, 1178, 855.0, 1134.5000000000002, 1178.0, 1178.0, 0.059517904969745065, 14.586207190506894, 0.030785791340144825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 268.375, 139, 707, 149.0, 512.4000000000002, 707.0, 707.0, 0.09183474337928897, 1.710859296976341, 0.05358521403234879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6326381d-53a2-4813-b2ee-7347cc3b14dd", 3, 0, 0.0, 1249.0, 322, 1757, 1668.0, 1757.0, 1757.0, 1757.0, 0.07546410424108266, 0.03340858781506264, 0.0483933220556422], "isController": false}, {"data": ["deleteBooks", 18, 5, 27.77777777777778, 571.0555555555557, 144, 2603, 420.0, 2180.9000000000005, 2603.0, 2603.0, 0.10153658701685507, 0.021566609058755837, 0.06799403719341592], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 388.5555555555555, 285, 875, 295.5, 861.5, 875.0, 875.0, 0.09004547296384674, 0.1395528960875242, 0.20251437913646392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 505.71999999999997, 180, 1133, 417.0, 1014.0000000000001, 1105.3999999999999, 1133.0, 0.10853568001944959, 0.06666888938694707, 0.04907423813379411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 142.41666666666666, 137, 147, 143.5, 146.7, 147.0, 147.0, 0.05951849537243699, 0.04423200681486772, 0.029875494747492785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 238.75, 137, 440, 143.5, 439.4, 440.0, 440.0, 0.059519971430413716, 0.09042308159692083, 0.029779360705906862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=727d60b2-b2c7-4ee9-8c7e-e7873f93b982", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["login", 25, 0, 0.0, 2735.8800000000006, 1512, 5675, 2673.0, 3944.6000000000013, 5249.299999999999, 5675.0, 0.10841283607979184, 57.20984744281223, 0.2426711228859497], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 150.8125, 140, 164, 150.0, 163.3, 164.0, 164.0, 0.09294490110081617, 0.07524543262946934, 0.03303900781318075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/266bf3ac-f360-407c-96bf-c1d2da6b7eda", 3, 0, 0.0, 559.3333333333334, 372, 820, 486.0, 820.0, 820.0, 820.0, 0.028762080073630927, 0.02397776271763307, 0.01844443285971775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a61a8d6-3d05-4a45-8952-ece4b509d1c6", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fcef437-59ad-404f-bd5b-2c1bdf9cdeef", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d23690e7-f7bb-44f3-a804-8a17d05a1b33", 3, 0, 0.0, 621.3333333333333, 235, 1359, 270.0, 1359.0, 1359.0, 1359.0, 0.03208659101361541, 0.026749270698525087, 0.02057636207578853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16b5ed2e-79c7-4ad3-ac56-74a8a2323ff7", 3, 0, 0.0, 468.0, 328, 698, 378.0, 698.0, 698.0, 698.0, 0.02377555872563005, 0.02810190551196703, 0.015246696187985416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce18a916-9a4f-4ca3-8573-39ffd0e2e1ea", 1, 0, 0.0, 994.0, 994, 994, 994.0, 994.0, 994.0, 994.0, 1.006036217303823, 0.18175459004024144, 0.6936148138832998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7064d765-e3c7-4525-9733-572a70d94b12", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1225.6666666666665, 292, 1464, 1412.0, 1451.7, 1464.0, 1464.0, 0.05947454241773927, 59.30888684410731, 0.12107870712257207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80503015-a11a-4a91-bd68-500157f24e95", 2, 0, 0.0, 263.5, 231, 296, 263.5, 296.0, 296.0, 296.0, 0.013018968637304553, 0.025732805197172276, 0.008092356970355808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb67873f-175f-4790-89ea-fa0d057fa53f", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 493.6666666666667, 282, 1369, 325.0, 864.6, 1318.8999999999992, 1369.0, 0.10288569888785459, 6.013148547351918, 0.23013881148645338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 21, 10, 47.61904761904762, 780.952380952381, 142, 1707, 1100.0, 1653.0000000000002, 1705.9, 1707.0, 0.13691485200156472, 85.81627330812361, 0.20491385773894902], "isController": false}, {"data": ["register", 26, 11, 42.30769230769231, 969.9230769230769, 197, 2072, 1016.5, 1536.9, 1912.3999999999994, 2072.0, 0.10588690464069722, 0.032755579425359914, 0.04777319330468957], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 156.39999999999998, 145, 189, 152.0, 184.8, 189.0, 189.0, 0.08045699573577922, 0.06246417149408641, 0.028599947702952773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 549.125, 288, 1473, 560.0, 1134.9000000000003, 1473.0, 1473.0, 0.09175258914337489, 6.993810866732232, 0.20488648842770468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb67873f-175f-4790-89ea-fa0d057fa53f", 3, 0, 0.0, 530.6666666666666, 315, 923, 354.0, 923.0, 923.0, 923.0, 0.05149595756733096, 0.03310693886571571, 0.03302312383061263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8de8b65a-0bf9-4e55-9b59-8799bbeb3b2f", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 546.3749999999999, 276, 1466, 438.5, 1235.7000000000003, 1466.0, 1466.0, 0.08448309546061768, 12.748459916071324, 0.18730248776315164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 173.29999999999998, 144, 414, 146.5, 387.6000000000001, 414.0, 414.0, 0.045157939894782, 0.033559758066337014, 0.022667169048747996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 170.09999999999997, 137, 417, 143.0, 389.80000000000007, 417.0, 417.0, 0.04510376120264669, 0.012068779853051945, 0.02572323881088444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 170.79999999999998, 136, 428, 142.5, 399.9000000000001, 428.0, 428.0, 0.04516099896129703, 0.012172300501287089, 0.02654972790498126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 231.70000000000002, 141, 442, 145.5, 441.9, 442.0, 442.0, 0.04510254062611346, 0.012156544153132146, 0.026559406247603928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 154.8, 144, 181, 148.0, 181.0, 181.0, 181.0, 0.04176725614187502, 0.012318077494967045, 0.025819016736139535], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1334.5614035087722, 1094, 2339, 1166.0, 1831.4, 2014.2999999999997, 2339.0, 0.2551225931197465, 305.2153163352311, 0.5037674641485619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, 42.30769230769231, 969.9230769230769, 197, 2072, 1016.5, 1536.9, 1912.3999999999994, 2072.0, 0.10601816172662809, 0.03279618314229676, 0.047832412810256034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 143.0, 138, 146, 144.0, 146.0, 146.0, 146.0, 0.025442217543681107, 0.006857472697320299, 0.014982087088710653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 143.75, 138, 151, 143.0, 151.0, 151.0, 151.0, 0.02544140843637104, 0.0068572546176156315, 0.014956765506538443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 247.93333333333337, 138, 573, 144.0, 495.6, 573.0, 573.0, 0.08228962656967463, 0.022179625911357616, 0.04837729999506263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 257.1333333333333, 137, 442, 144.0, 441.4, 442.0, 442.0, 0.08228782085392815, 0.02217913921453532, 0.04845659763175651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 182.06666666666663, 137, 434, 144.0, 429.2, 434.0, 434.0, 0.08228601521742708, 0.06115200935591993, 0.04130372248218508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 141.5, 138, 147, 140.5, 147.0, 147.0, 147.0, 0.02544205571810202, 0.006807737565195268, 0.01450992240173006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 162.06666666666666, 137, 432, 143.0, 262.2000000000001, 432.0, 432.0, 0.08229007801099396, 0.02201902478028549, 0.04693106011564499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 147.0, 145, 151, 146.0, 151.0, 151.0, 151.0, 0.025442217543681107, 0.018907741748770822, 0.012770800602980557], "isController": false}, {"data": ["deleteAccount", 18, 5, 27.77777777777778, 617.4444444444443, 143, 1757, 565.5, 1398.8000000000006, 1757.0, 1757.0, 0.10227505170572058, 0.020946631954703514, 0.06958720830302961], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 152.25, 146, 157, 153.0, 157.0, 157.0, 157.0, 0.0249044292527426, 0.019602509743857945, 0.008852746335935847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1393.56, 659, 4346, 1232.0, 2027.8, 3652.6999999999985, 4346.0, 0.10928579546944807, 0.05656393710821042, 0.05026719693956058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f350e80-4fe9-4403-ae64-baa111e64527", 3, 0, 0.0, 602.0, 314, 881, 611.0, 881.0, 881.0, 881.0, 0.05988621618924044, 0.027096953288751374, 0.038403595668230366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 293.0, 288, 302, 291.0, 302.0, 302.0, 302.0, 0.02541780517252335, 0.03939263360233844, 0.05716523956281375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6326381d-53a2-4813-b2ee-7347cc3b14dd", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["addBook", 55, 15, 27.272727272727273, 1411.490909090909, 726, 4843, 1150.0, 2457.4, 3466.9999999999995, 4843.0, 0.26300059772863116, 81.21570531978482, 0.9539748953974896], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 257.26315789473693, 143, 827, 149.0, 576.4, 584.6999999999999, 827.0, 0.2562569402921329, 0.19044094879132145, 0.12387420453574785], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 816.3508771929825, 678, 1165, 716.0, 1088.0, 1130.1999999999998, 1165.0, 0.25646332574441855, 75.40873315272167, 0.12898302027185113], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 200.01754385964907, 138, 445, 146.0, 416.80000000000007, 433.19999999999993, 445.0, 0.25708911971783344, 0.4549272313756974, 0.12502966955027445], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1070.2280701754387, 948, 1473, 998.0, 1313.4, 1435.7999999999997, 1473.0, 0.25611531479717464, 230.45301045719953, 0.12855788262280055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 150.125, 144, 160, 149.5, 159.3, 160.0, 160.0, 0.08480595337792712, 0.06335601009190846, 0.030145866239810037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 15, 8.982035928143713, 248.67664670658678, 137, 3134, 152.0, 391.2000000000003, 483.99999999999966, 2236.399999999991, 0.6889979000004125, 1.623452913491569, 0.3263239551058045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 150.0, 144, 161, 150.0, 160.4, 161.0, 161.0, 0.04497171279265342, 0.03482672680134195, 0.01598603853176352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 179.28571428571428, 142, 438, 151.0, 382.4000000000002, 437.4, 438.0, 0.1058382388517055, 0.0858902114118821, 0.03762218646681719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=266bf3ac-f360-407c-96bf-c1d2da6b7eda", 1, 0, 0.0, 2603.0, 2603, 2603, 2603.0, 2603.0, 2603.0, 2603.0, 0.384172109104879, 0.06940609393008067, 0.26486866116019975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 406.6, 288, 837, 297.0, 812.1000000000001, 837.0, 837.0, 0.04507184452016514, 0.06985255591162313, 0.10136763469720735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fcef437-59ad-404f-bd5b-2c1bdf9cdeef", 3, 0, 0.0, 349.6666666666667, 242, 453, 354.0, 453.0, 453.0, 453.0, 0.04813863928112965, 0.030509743060012837, 0.030870156049422337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16b5ed2e-79c7-4ad3-ac56-74a8a2323ff7", 1, 0, 0.0, 2134.0, 2134, 2134, 2134.0, 2134.0, 2134.0, 2134.0, 0.46860356138706655, 0.08465982310215558, 0.32308018978444236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d23690e7-f7bb-44f3-a804-8a17d05a1b33", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 472.7333333333333, 286, 877, 299.0, 862.0, 877.0, 877.0, 0.08222151572623525, 0.12742729048587434, 0.1849181159350779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a61a8d6-3d05-4a45-8952-ece4b509d1c6", 3, 0, 0.0, 551.3333333333334, 324, 911, 419.0, 911.0, 911.0, 911.0, 0.026306097753459254, 0.03109291697357114, 0.01686947023903474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7064d765-e3c7-4525-9733-572a70d94b12", 3, 0, 0.0, 556.0, 317, 901, 450.0, 901.0, 901.0, 901.0, 0.05294834006953882, 0.023957745018443673, 0.033954501932614414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 168.88888888888889, 145, 432, 150.5, 218.70000000000033, 432.0, 432.0, 0.08955223880597016, 0.07424790111940298, 0.031833022388059705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 149.75, 144, 167, 148.0, 162.8, 167.0, 167.0, 0.05685560098739227, 0.04414082303220396, 0.020210389413487094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/727d60b2-b2c7-4ee9-8c7e-e7873f93b982", 3, 0, 0.0, 396.6666666666667, 269, 599, 322.0, 599.0, 599.0, 599.0, 0.03195909236177693, 0.02664298031852562, 0.020494600245019708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a9dc9b7-40de-40d2-abaf-bfc06e7250a6", 3, 0, 0.0, 356.6666666666667, 236, 532, 302.0, 532.0, 532.0, 532.0, 0.049478007025877, 0.0307787992924645, 0.03172906049510992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 167.87500000000003, 137, 512, 144.5, 260.0000000000002, 512.0, 512.0, 0.08454738088066666, 0.06283257504901106, 0.04243882204361588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 179.3125, 136, 427, 144.0, 427.0, 427.0, 427.0, 0.08454559385353533, 0.03849549134200278, 0.04732984538724524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 324.0625, 137, 1314, 145.0, 1088.6000000000001, 1314.0, 1314.0, 0.08454604060323599, 9.529273818865391, 0.04879561523096921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 360.625, 138, 1142, 284.5, 1017.4000000000001, 1142.0, 1142.0, 0.08454738088066666, 3.127406793117843, 0.048878954571635415], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 23.91304347826087, 0.819672131147541], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.869565217391305, 0.37257824143070045], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 10.869565217391305, 0.37257824143070045], "isController": false}, {"data": ["401/Unauthorized", 25, 54.34782608695652, 1.8628912071535022], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1342, 46, "401/Unauthorized", 25, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 21, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

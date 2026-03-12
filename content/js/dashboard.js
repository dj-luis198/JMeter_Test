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

    var data = {"OkPercent": 99.17168674698796, "KoPercent": 0.8283132530120482};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7776699029126214, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b41148da-9853-4e68-a186-d2cd6b6bdbb1"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f4848a03-f329-4075-9351-9ff61d01c1da"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3575587e-ceb9-43f6-9984-989c5d8b7cd4"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a3fdab9-ff57-4f7c-8896-30d134f2bef1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/877bf1e2-3cd0-4b7c-aafa-da21f62f9c05"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90062afe-dc57-49ae-9587-86d079a0d6cf"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9026f777-f910-4c9b-aaab-d4e09135338f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9026f777-f910-4c9b-aaab-d4e09135338f"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8843a5e0-8f9f-416b-b428-363ab9960f11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a3fdab9-ff57-4f7c-8896-30d134f2bef1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/122f978e-9bda-43fd-8e05-c94bff919028"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a63fde8-159b-49b1-9637-a94a3d9f15d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e1f46ef-1977-4dc2-aa90-ec830499258f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb5a8a29-6cf3-48cb-9292-66115b8f7f07"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7de76024-e23d-44e1-82a2-544b4429d554"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/134d11b9-897d-4fc5-be6b-0f9e31970cb9"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/56b8220b-382f-4b25-a573-99236ba6df52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e1f46ef-1977-4dc2-aa90-ec830499258f"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b41148da-9853-4e68-a186-d2cd6b6bdbb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3575587e-ceb9-43f6-9984-989c5d8b7cd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90062afe-dc57-49ae-9587-86d079a0d6cf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84f1c177-b64c-4f59-972a-2f20383698c7"], "isController": false}, {"data": [0.328125, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/09170949-8847-4ea7-96e4-f08581e09fb2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=122f978e-9bda-43fd-8e05-c94bff919028"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9644808743169399, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=877bf1e2-3cd0-4b7c-aafa-da21f62f9c05"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/84f1c177-b64c-4f59-972a-2f20383698c7"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09170949-8847-4ea7-96e4-f08581e09fb2"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8843a5e0-8f9f-416b-b428-363ab9960f11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a63fde8-159b-49b1-9637-a94a3d9f15d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=134d11b9-897d-4fc5-be6b-0f9e31970cb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7de76024-e23d-44e1-82a2-544b4429d554"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1328, 11, 0.8283132530120482, 416.94954819277086, 137, 2428, 157.0, 1094.7000000000023, 1281.1, 1743.2600000000002, 5.117454836919663, 694.8318504965241, 3.7376403338195168], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2094.6727272727267, 1684, 2585, 2080.0, 2449.2, 2528.7999999999997, 2585.0, 0.2347948959858611, 282.53666935969295, 1.154484669227354], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b41148da-9853-4e68-a186-d2cd6b6bdbb1", 3, 0, 0.0, 363.6666666666667, 247, 429, 415.0, 429.0, 429.0, 429.0, 0.07254086468710706, 0.04597560662298095, 0.0465187185656253], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 539.9285714285713, 445, 661, 539.5, 657.5, 661.0, 661.0, 0.07890257785993665, 0.014254860257898712, 0.05362909588917569], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 539.9285714285713, 445, 661, 539.5, 657.5, 661.0, 661.0, 0.08156321731936661, 0.014735542191487132, 0.05543749927175699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 208.72222222222223, 138, 443, 144.0, 440.3, 443.0, 443.0, 0.09325893342866469, 0.048299141629233565, 0.05188135326483983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 161.72222222222226, 141, 427, 145.5, 180.40000000000038, 427.0, 427.0, 0.09325651759439632, 0.0693048924700543, 0.04681040043312472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4848a03-f329-4075-9351-9ff61d01c1da", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.5005265478056427, 0.9352346199059561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 301.33333333333337, 142, 988, 149.0, 967.3000000000001, 988.0, 988.0, 0.09325555129573408, 4.590984147203888, 0.05357944272036805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 354.66666666666663, 140, 1293, 147.0, 1055.4000000000003, 1293.0, 1293.0, 0.09325555129573408, 14.006197568037695, 0.05348837284605581], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3575587e-ceb9-43f6-9984-989c5d8b7cd4", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 273.42857142857144, 231, 429, 262.5, 379.5, 429.0, 429.0, 0.07907281476628335, 0.18377148733140547, 0.051119339233671464], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 146.5555555555556, 140, 154, 145.0, 152.2, 154.0, 154.0, 0.11195422316208484, 0.08320035529916656, 0.05619577217315586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 207.2777777777778, 140, 445, 144.5, 433.3, 445.0, 445.0, 0.11195491948575374, 0.03929841195056569, 0.06332693091137524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 934.75, 734, 1030, 987.5, 1030.0, 1030.0, 1030.0, 0.06654024021026717, 19.565039965731778, 0.03794873074491799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1103.75, 1016, 1317, 1041.0, 1317.0, 1317.0, 1317.0, 0.06651036730350343, 59.84614541244742, 0.037866742322209476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 289.75, 144, 447, 284.0, 447.0, 447.0, 447.0, 0.06719188322050695, 0.11889813710503772, 0.03720488065041743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 171.83333333333334, 141, 448, 146.0, 360.7000000000003, 448.0, 448.0, 0.09408149025080557, 0.06991798250084282, 0.04722449803604889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a3fdab9-ff57-4f7c-8896-30d134f2bef1", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 241.83333333333331, 142, 441, 148.0, 440.1, 441.0, 441.0, 0.09407927747114903, 0.04872400079967386, 0.052337723046287005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/877bf1e2-3cd0-4b7c-aafa-da21f62f9c05", 3, 0, 0.0, 384.0, 287, 466, 399.0, 466.0, 466.0, 466.0, 0.021659867874805963, 0.025601230551243637, 0.013889954333778565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 378.0, 138, 1272, 146.0, 1270.2, 1272.0, 1272.0, 0.09408370313455539, 14.130578992089127, 0.05396337399840057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90062afe-dc57-49ae-9587-86d079a0d6cf", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 347.16666666666674, 139, 1135, 149.5, 1086.1000000000001, 1135.0, 1135.0, 0.09407927747114903, 4.631536304801179, 0.054052709875188155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 150.25, 147, 157, 148.5, 157.0, 157.0, 157.0, 0.06752992419766009, 0.050185812807050124, 0.03791963516958453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 988.7692307692307, 152, 1362, 1276.0, 1358.0, 1362.0, 1362.0, 0.060424364963164376, 41.82679668072695, 0.03152851855725208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 222.94444444444443, 138, 1265, 144.0, 521.6000000000012, 1265.0, 1265.0, 0.11195283054073218, 5.62490694892774, 0.06528152249629933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 811.3076923076923, 144, 1063, 995.0, 1051.4, 1063.0, 1063.0, 0.06042970166321133, 13.671711578330838, 0.031590316547046846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 211.77777777777777, 142, 1021, 147.5, 502.6000000000008, 1021.0, 1021.0, 0.11195074167366359, 1.857233164629785, 0.06538963133998818], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 506.1428571428571, 230, 681, 530.5, 676.0, 681.0, 681.0, 0.08152569515213277, 0.014728763284320863, 0.05620814529043529], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9026f777-f910-4c9b-aaab-d4e09135338f", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 629.0, 289, 1714, 582.5, 1627.0000000000002, 1714.0, 1714.0, 0.09397171451393131, 18.858504905127724, 0.20733733104668828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9026f777-f910-4c9b-aaab-d4e09135338f", 3, 0, 0.0, 486.66666666666663, 231, 808, 421.0, 808.0, 808.0, 808.0, 0.07536552278550973, 0.03410093641662061, 0.04833010413003065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 463.0476190476191, 159, 860, 475.0, 781.8000000000001, 854.9999999999999, 860.0, 0.09007501962348642, 0.05532928451481734, 0.04072727938054122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 147.69230769230768, 140, 155, 149.0, 153.8, 155.0, 155.0, 0.06050451456762543, 0.04496478084566694, 0.030370430163827608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8843a5e0-8f9f-416b-b428-363ab9960f11", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.26529230910425844, 1.012412812041116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 232.6153846153846, 140, 430, 150.0, 429.6, 430.0, 430.0, 0.06050169870154047, 0.08608948143063247, 0.03059626169311677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a3fdab9-ff57-4f7c-8896-30d134f2bef1", 3, 0, 0.0, 322.3333333333333, 266, 431, 270.0, 431.0, 431.0, 431.0, 0.09756732145180173, 0.045861722713672434, 0.06256758569663068], "isController": false}, {"data": ["login", 21, 0, 0.0, 2303.047619047619, 1528, 3701, 2187.0, 3054.8, 3637.2999999999993, 3701.0, 0.08746392113253282, 20.052511216727268, 0.1595899308722652], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/122f978e-9bda-43fd-8e05-c94bff919028", 3, 0, 0.0, 336.3333333333333, 228, 542, 239.0, 542.0, 542.0, 542.0, 0.030945381401825782, 0.031237509025736243, 0.01984453169322812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a63fde8-159b-49b1-9637-a94a3d9f15d7", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 168.61111111111111, 145, 441, 151.5, 192.6000000000004, 441.0, 441.0, 0.10957436446868608, 0.08870815248490309, 0.038950262369728254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1141.4615384615386, 300, 1505, 1420.0, 1504.2, 1505.0, 1505.0, 0.060384229497231615, 55.59123581696379, 0.12392103107233102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e1f46ef-1977-4dc2-aa90-ec830499258f", 2, 0, 0.0, 302.0, 274, 330, 302.0, 330.0, 330.0, 330.0, 0.01639398013049608, 0.028017055887078268, 0.010190203469785894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb5a8a29-6cf3-48cb-9292-66115b8f7f07", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 536.0555555555555, 290, 1437, 303.0, 1204.8000000000004, 1437.0, 1437.0, 0.09318361831989935, 18.700347570043018, 0.20559849120191337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7de76024-e23d-44e1-82a2-544b4429d554", 3, 0, 0.0, 394.6666666666667, 306, 541, 337.0, 541.0, 541.0, 541.0, 0.01712250582165198, 0.02360475656077348, 0.010980252756723437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1254.5, 1164, 1466, 1194.0, 1466.0, 1466.0, 1466.0, 0.06634599436059048, 79.37287485486814, 0.14960244236191741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/134d11b9-897d-4fc5-be6b-0f9e31970cb9", 3, 0, 0.0, 292.0, 231, 402, 243.0, 402.0, 402.0, 402.0, 0.05905511811023622, 0.037966750738188976, 0.037870632381889764], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 981.5909090909089, 237, 2209, 945.0, 1728.8999999999999, 2148.099999999999, 2209.0, 0.09293052176263855, 0.029387297453703706, 0.04192763774837794], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/56b8220b-382f-4b25-a573-99236ba6df52", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.6141075721153846, 1.1474609375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 183.82352941176472, 145, 451, 150.0, 428.59999999999997, 451.0, 451.0, 0.11195258478761935, 0.08691631338491933, 0.03979564537372407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 452.5555555555556, 284, 1410, 298.5, 680.1000000000012, 1410.0, 1410.0, 0.11184848258891954, 7.597583674704223, 0.249959998632963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e1f46ef-1977-4dc2-aa90-ec830499258f", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 448.1578947368421, 290, 896, 303.0, 593.0, 896.0, 896.0, 0.11314305450517778, 0.1753496362301925, 0.2544613813724848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 171.72727272727275, 142, 428, 146.0, 372.6000000000002, 428.0, 428.0, 0.05663068044336674, 0.04208588654043173, 0.02842594701942432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 172.09090909090907, 139, 440, 145.0, 382.2000000000002, 440.0, 440.0, 0.05663242978865807, 0.015153599377043272, 0.032298182613844054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 197.90909090909093, 139, 440, 145.0, 438.0, 440.0, 440.0, 0.05654771084585094, 0.01524137518892076, 0.03324386907148658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 173.1818181818182, 137, 446, 146.0, 387.6000000000002, 446.0, 446.0, 0.05663155510250312, 0.015263973836221544, 0.033348464576962285], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1387.6727272727271, 1110, 2001, 1188.0, 1831.8, 1941.7999999999997, 2001.0, 0.24305202639103093, 290.77472211972304, 0.4799328099244771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 981.5909090909089, 237, 2209, 945.0, 1728.8999999999999, 2148.099999999999, 2209.0, 0.08936151199678298, 0.02825867415949405, 0.040317400920423574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b41148da-9853-4e68-a186-d2cd6b6bdbb1", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 145.1818181818182, 139, 153, 143.0, 153.0, 153.0, 153.0, 0.057453854108995187, 0.015485609115315109, 0.03383268948019931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 213.54545454545456, 139, 599, 146.0, 564.0000000000001, 599.0, 599.0, 0.05745475438092502, 0.015485851766733696, 0.033777111462223494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 194.0, 137, 444, 145.0, 432.0, 444.0, 444.0, 0.1101649882706689, 0.029692906994828728, 0.06476496380756121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 179.58823529411765, 137, 456, 145.0, 423.2, 456.0, 456.0, 0.10997043735889822, 0.02964046944439054, 0.06475798215567934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 172.0, 139, 436, 147.0, 378.6000000000002, 436.0, 436.0, 0.057454154196503654, 0.01537347485336133, 0.03276682231519349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3575587e-ceb9-43f6-9984-989c5d8b7cd4", 3, 0, 0.0, 324.0, 232, 503, 237.0, 503.0, 503.0, 503.0, 0.04837695321948624, 0.031101719599116315, 0.031022981068485642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 146.47058823529412, 138, 155, 147.0, 151.8, 155.0, 155.0, 0.1101664160920732, 0.08187172133405049, 0.055298376827466425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 174.0, 139, 459, 148.0, 397.4000000000002, 459.0, 459.0, 0.057456254896839906, 0.04269942380517106, 0.028840346696265347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 160.35294117647058, 137, 428, 144.0, 205.5999999999998, 428.0, 428.0, 0.11016284660795636, 0.029477167940019568, 0.0628272484561001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 150.45454545454544, 143, 156, 151.0, 155.8, 156.0, 156.0, 0.05707229503263498, 0.04492213847295292, 0.020287417374881964], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 498.4615384615385, 402, 808, 498.0, 701.5999999999999, 808.0, 808.0, 0.07446570854121677, 0.013453277421997171, 0.05068613169260556], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1231.7142857142858, 936, 1751, 1228.0, 1658.4, 1743.8, 1751.0, 0.0883845823618044, 0.04574592641773079, 0.040653455363681514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 390.54545454545456, 282, 1058, 297.0, 961.2000000000003, 1058.0, 1058.0, 0.05741187277528993, 0.08897718954529796, 0.1291206474623952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90062afe-dc57-49ae-9587-86d079a0d6cf", 3, 0, 0.0, 368.3333333333333, 237, 531, 337.0, 531.0, 531.0, 531.0, 0.020637989034348492, 0.024393404356679485, 0.013234647915907075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84f1c177-b64c-4f59-972a-2f20383698c7", 1, 0, 0.0, 671.0, 671, 671, 671.0, 671.0, 671.0, 671.0, 1.4903129657228018, 0.2692459947839046, 1.0275009314456036], "isController": false}, {"data": ["addBook", 64, 6, 9.375, 1277.4374999999995, 751, 2365, 1148.5, 2080.5, 2229.0, 2365.0, 0.29479502533394747, 89.27261162770613, 1.0733505944841086], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/09170949-8847-4ea7-96e4-f08581e09fb2", 3, 0, 0.0, 1038.6666666666667, 266, 2428, 422.0, 2428.0, 2428.0, 2428.0, 0.021138669673055242, 0.024985191921505074, 0.013555722414036077], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 270.38181818181823, 141, 618, 151.0, 578.6, 595.0, 618.0, 0.24415579803432386, 0.18144781475011765, 0.11802453127635773], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 832.4727272727275, 680, 1189, 740.0, 1038.4, 1160.0, 1189.0, 0.24404746057524204, 71.75805654746057, 0.12273871308227505], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 224.21818181818182, 139, 615, 148.0, 448.6, 457.0, 615.0, 0.24466845200494675, 0.4329484717118784, 0.11898914951021825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=122f978e-9bda-43fd-8e05-c94bff919028", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1111.0909090909092, 964, 1423, 1025.0, 1346.0, 1386.2, 1423.0, 0.24371978428583457, 219.29949031407725, 0.12233590734660055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 183.4736842105263, 145, 446, 154.0, 429.0, 446.0, 446.0, 0.11768130663412882, 0.08791621052256694, 0.04183202696760048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, 3.278688524590164, 200.60655737704926, 139, 529, 154.0, 326.0, 364.39999999999986, 483.6399999999998, 0.7775785439310632, 1.573626404049782, 0.3782288563965396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 152.27272727272728, 144, 161, 152.0, 160.2, 161.0, 161.0, 0.060553347499146745, 0.046893363834788454, 0.02152482274383732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 168.22222222222223, 144, 430, 151.0, 205.90000000000035, 430.0, 430.0, 0.09166696373553063, 0.07438988951584566, 0.032584741015364405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=877bf1e2-3cd0-4b7c-aafa-da21f62f9c05", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84f1c177-b64c-4f59-972a-2f20383698c7", 3, 0, 0.0, 349.6666666666667, 259, 508, 282.0, 508.0, 508.0, 508.0, 0.04352367688022284, 0.027981530546367223, 0.02791069122852832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 400.6363636363636, 292, 874, 298.0, 816.2000000000003, 874.0, 874.0, 0.05650530122462398, 0.08757218070652174, 0.1270817467971768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09170949-8847-4ea7-96e4-f08581e09fb2", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 379.0, 284, 605, 296.0, 597.0, 605.0, 605.0, 0.10987022387673853, 0.1702773879808438, 0.24710070858215707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8843a5e0-8f9f-416b-b428-363ab9960f11", 3, 0, 0.0, 339.0, 235, 498, 284.0, 498.0, 498.0, 498.0, 0.019740608405551058, 0.027214022329918208, 0.01265917921840351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 175.83333333333337, 144, 449, 151.0, 362.6000000000003, 449.0, 449.0, 0.08599376545200474, 0.07129756530151565, 0.03056809631301731], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 151.76923076923077, 145, 158, 153.0, 158.0, 158.0, 158.0, 0.05974209795865847, 0.04638180456751317, 0.021236448883741876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a63fde8-159b-49b1-9637-a94a3d9f15d7", 3, 0, 0.0, 353.3333333333333, 231, 416, 413.0, 416.0, 416.0, 416.0, 0.022318107424490405, 0.026379247414819226, 0.014312067586668652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=134d11b9-897d-4fc5-be6b-0f9e31970cb9", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 162.42105263157896, 139, 444, 147.0, 153.0, 444.0, 444.0, 0.11344841381204583, 0.08431078409274109, 0.056945785839249564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 266.05263157894734, 140, 454, 151.0, 446.0, 454.0, 454.0, 0.11325500855373354, 0.03030456283566698, 0.06459074706580116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 205.99999999999997, 141, 449, 146.0, 428.0, 449.0, 449.0, 0.11344299489506524, 0.030576432217810548, 0.0666920731707317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 205.36842105263162, 138, 451, 147.0, 432.0, 451.0, 451.0, 0.11323948362795465, 0.03052157957159715, 0.06668301623794595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7de76024-e23d-44e1-82a2-544b4429d554", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 45.45454545454545, 0.37650602409638556], "isController": false}, {"data": ["401/Unauthorized", 6, 54.54545454545455, 0.45180722891566266], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1328, 11, "401/Unauthorized", 6, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

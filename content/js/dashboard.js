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

    var data = {"OkPercent": 97.6709241172051, "KoPercent": 2.329075882794891};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7191736604260813, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13b30181-66c8-4b41-b875-ca828dc9a263"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/859b5465-3e76-4224-a78b-427371abb39b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=793b0c05-c992-4038-a828-ee342e2f5e4f"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5476190476190477, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/064b980f-512f-414f-8309-d42a5bcaffa9"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8a620ffa-5057-4c2e-aa64-6f84a5fbfc7f"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/952622d3-023f-4a80-b363-c7ea8a943441"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5504c1c7-44be-48a7-ad28-26565b95b33d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eefe1c55-a2b2-49fa-ad91-5cdebf0671d8"], "isController": false}, {"data": [0.5238095238095238, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b341b88-f8cf-488c-98cd-39b78bd3376f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13b30181-66c8-4b41-b875-ca828dc9a263"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f360f630-143d-4150-a837-ae16bcd77280"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b823e881-e074-49a8-8677-d6c72dcebce3"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/793b0c05-c992-4038-a828-ee342e2f5e4f"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.19642857142857142, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.27049180327868855, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b9693db3-56da-45a2-9316-af5028b92812"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a620ffa-5057-4c2e-aa64-6f84a5fbfc7f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=064b980f-512f-414f-8309-d42a5bcaffa9"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9073033707865169, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9693db3-56da-45a2-9316-af5028b92812"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eefe1c55-a2b2-49fa-ad91-5cdebf0671d8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5504c1c7-44be-48a7-ad28-26565b95b33d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=859b5465-3e76-4224-a78b-427371abb39b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f360f630-143d-4150-a837-ae16bcd77280"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0b341b88-f8cf-488c-98cd-39b78bd3376f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e8c13b6-d2eb-4cab-94fe-1d8e7237c5dd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b823e881-e074-49a8-8677-d6c72dcebce3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dcf4dfca-69e5-4822-8be7-4521202bf6b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1331, 31, 2.329075882794891, 488.93914350112647, 138, 2991, 163.0, 1415.6, 1709.0, 2144.6800000000003, 5.292267563688126, 735.9733887174999, 3.8773529541866965], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2433.9107142857138, 1736, 3498, 2448.0, 2821.4, 2963.95, 3498.0, 0.2459678836220528, 295.98240989916417, 1.2094221621455428], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13b30181-66c8-4b41-b875-ca828dc9a263", 1, 0, 0.0, 1322.0, 1322, 1322, 1322.0, 1322.0, 1322.0, 1322.0, 0.7564296520423601, 0.13665965393343418, 0.5215227874432677], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 655.5333333333333, 151, 1562, 512.0, 1401.2, 1562.0, 1562.0, 0.08681811604688179, 0.017668843148603675, 0.05817831174938504], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 655.5333333333333, 151, 1562, 512.0, 1401.2, 1562.0, 1562.0, 0.08650868258810909, 0.01760586860484564, 0.05797095507027389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/859b5465-3e76-4224-a78b-427371abb39b", 3, 0, 0.0, 400.6666666666667, 234, 531, 437.0, 531.0, 531.0, 531.0, 0.04719578384331, 0.030342341500825928, 0.030265525446393455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 194.83333333333334, 138, 445, 147.5, 441.4, 445.0, 445.0, 0.0989032725993978, 0.0347170233136992, 0.05594430990241543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 164.16666666666663, 140, 425, 150.0, 182.0000000000004, 425.0, 425.0, 0.09905403397553365, 0.07361339829627062, 0.04972048189787529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 184.55555555555554, 139, 854, 144.5, 225.80000000000098, 854.0, 854.0, 0.09905894006934125, 1.6433615892080788, 0.05785962178746354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 274.16666666666674, 140, 1579, 149.0, 557.5000000000016, 1579.0, 1579.0, 0.09890598985664126, 4.969387437084801, 0.0576736967762142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=793b0c05-c992-4038-a828-ee342e2f5e4f", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 293.43750000000006, 148, 608, 255.5, 513.5000000000001, 608.0, 608.0, 0.09176679762553411, 0.1734293897507958, 0.0593089978062], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 172.46153846153845, 144, 468, 149.0, 341.1999999999999, 468.0, 468.0, 0.12498918362833984, 0.09288746947379553, 0.06273871131344402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 213.23076923076923, 143, 447, 148.0, 447.0, 447.0, 447.0, 0.12462851116863197, 0.04774680040264596, 0.07027205565142364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1051.7142857142858, 856, 1282, 1124.0, 1282.0, 1282.0, 1282.0, 0.05554144979052939, 16.331030388115717, 0.03167598308366129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1584.142857142857, 1325, 1846, 1568.0, 1846.0, 1846.0, 1846.0, 0.055438957747594345, 49.884071632578305, 0.03156339098324951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 310.57142857142856, 144, 437, 428.0, 437.0, 437.0, 437.0, 0.05587573237120644, 0.09887385454748639, 0.03093900415475981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 189.2857142857143, 143, 433, 149.5, 429.5, 433.0, 433.0, 0.08373155662944601, 0.062226283784187895, 0.04202931651126489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 210.78571428571425, 142, 446, 148.0, 445.0, 446.0, 446.0, 0.08359306894039814, 0.02236767665006747, 0.047674172130070816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 238.2142857142857, 140, 573, 146.5, 508.5, 573.0, 573.0, 0.08373606392650365, 0.02256948598019044, 0.04922764695679219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 266.2857142857143, 143, 593, 149.0, 547.5, 593.0, 593.0, 0.08359506550270489, 0.022531482498775932, 0.04922639111145611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 189.57142857142856, 144, 447, 148.0, 447.0, 447.0, 447.0, 0.05600358422939068, 0.04161985117047491, 0.03144732512880824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 890.4761904761904, 141, 1904, 154.0, 1855.8, 1899.3, 1904.0, 0.1012360438882354, 43.39161197610347, 0.05537287705605584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 332.69230769230774, 142, 1695, 150.0, 1194.5999999999995, 1695.0, 1695.0, 0.12464404537043251, 8.658313593032398, 0.0724530966854272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 569.8095238095236, 142, 1335, 155.0, 1261.0, 1329.8, 1335.0, 0.10123799606618072, 14.189213212040572, 0.05547281006546724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 329.0, 143, 1324, 150.0, 972.3999999999996, 1324.0, 1324.0, 0.12499038535497269, 2.858122241798708, 0.0727764781314899], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 537.6153846153846, 154, 1322, 482.0, 1108.7999999999997, 1322.0, 1322.0, 0.0861457718992492, 0.017077726265183193, 0.05844866374654588], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/064b980f-512f-414f-8309-d42a5bcaffa9", 3, 0, 0.0, 757.3333333333333, 246, 1638, 388.0, 1638.0, 1638.0, 1638.0, 0.020426088199848848, 0.02414294474402707, 0.013098760987533277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 500.35714285714283, 291, 878, 444.5, 875.0, 878.0, 878.0, 0.08351727017836902, 0.12943545680964028, 0.18783229806717175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a620ffa-5057-4c2e-aa64-6f84a5fbfc7f", 3, 0, 0.0, 1036.6666666666667, 378, 2145, 587.0, 2145.0, 2145.0, 2145.0, 0.02672296304214211, 0.026801252972929637, 0.01713679596126952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 592.3809523809524, 165, 1359, 513.0, 1184.0, 1341.8999999999996, 1359.0, 0.08864424952089894, 0.05445042280141156, 0.04008035891423458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 147.8095238095238, 144, 151, 149.0, 151.0, 151.0, 151.0, 0.1012360438882354, 0.07523498964740932, 0.05081574859233691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 260.0476190476191, 141, 448, 150.0, 447.0, 447.9, 448.0, 0.10123946024904908, 0.09949752385153474, 0.053689304533117356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/952622d3-023f-4a80-b363-c7ea8a943441", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["login", 21, 0, 0.0, 3044.190476190476, 1635, 5199, 2640.0, 4385.8, 5119.899999999999, 5199.0, 0.08964321998446186, 35.8686976614325, 0.18480159901093648], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 154.6153846153846, 147, 172, 152.0, 167.6, 172.0, 172.0, 0.12117257771356667, 0.0980977216060027, 0.043073064734119405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5504c1c7-44be-48a7-ad28-26565b95b33d", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eefe1c55-a2b2-49fa-ad91-5cdebf0671d8", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 1040.5714285714282, 293, 2050, 303.0, 2006.6, 2045.8, 2050.0, 0.1011628915244766, 57.7135472241023, 0.2151922501397011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b341b88-f8cf-488c-98cd-39b78bd3376f", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 457.1666666666667, 290, 1726, 301.0, 941.2000000000012, 1726.0, 1726.0, 0.09882073917912906, 6.712642114859895, 0.22084548004919077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 1122.0, 148, 2293, 1518.5, 2200.3, 2293.0, 2293.0, 0.09492844768255927, 66.25824876296366, 0.15093684983901717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13b30181-66c8-4b41-b875-ca828dc9a263", 3, 0, 0.0, 350.6666666666667, 270, 510, 272.0, 510.0, 510.0, 510.0, 0.03369612831485662, 0.021663363744089136, 0.021608519785243342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f360f630-143d-4150-a837-ae16bcd77280", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b823e881-e074-49a8-8677-d6c72dcebce3", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1132.3478260869565, 166, 2152, 1076.0, 2149.2, 2151.6, 2152.0, 0.09471178791148153, 0.029404406980670556, 0.04273129493662546], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/793b0c05-c992-4038-a828-ee342e2f5e4f", 3, 0, 0.0, 323.3333333333333, 240, 460, 270.0, 460.0, 460.0, 460.0, 0.018276523805172258, 0.025195663513966307, 0.011720296841207468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 600.4615384615385, 290, 1845, 590.0, 1472.9999999999995, 1845.0, 1845.0, 0.12445431569273185, 11.63116826702152, 0.27745122647334763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 168.6842105263158, 147, 430, 153.0, 170.0, 430.0, 430.0, 0.11723691111591028, 0.09101889095424676, 0.04167405824823373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 463.6428571428571, 293, 598, 576.0, 596.0, 598.0, 598.0, 0.0730643174748972, 0.11323542171158382, 0.1643233624459846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 237.60000000000002, 144, 450, 149.5, 449.6, 450.0, 450.0, 0.04765876325509353, 0.035418280114381036, 0.023922465149529372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 235.0, 143, 444, 146.5, 443.7, 444.0, 444.0, 0.04765967181549988, 0.012752685622506803, 0.027180906582277276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 238.2, 143, 443, 149.5, 442.1, 443.0, 443.0, 0.04765876325509353, 0.012845526033599428, 0.02801814011676397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 208.5, 139, 447, 148.0, 446.4, 447.0, 447.0, 0.04765876325509353, 0.012845526033599428, 0.028064681877755272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 154.5, 154, 155, 154.5, 155.0, 155.0, 155.0, 0.0499226199390944, 0.014723272677350107, 0.0308603695521941], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1670.2499999999998, 1140, 2875, 1625.0, 2191.2000000000003, 2347.7, 2875.0, 0.24618198123741614, 294.5192362643643, 0.486113248107476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1132.3478260869565, 166, 2152, 1076.0, 2149.2, 2151.6, 2152.0, 0.094424441972075, 0.02931519699812383, 0.04260165253036978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 144.0, 142, 149, 142.5, 149.0, 149.0, 149.0, 0.03552902721523484, 0.009576183116606267, 0.0209218783308463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 222.125, 143, 443, 150.0, 443.0, 443.0, 443.0, 0.03552981617761355, 0.009576395766622402, 0.02088764583879234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 335.68421052631584, 138, 1869, 145.0, 1767.0, 1869.0, 1869.0, 0.11161763323620642, 10.598890561113592, 0.06460926117938716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 284.2105263157894, 138, 1177, 149.0, 1145.0, 1177.0, 1177.0, 0.11161632183097764, 3.4815388806645284, 0.06471750239387637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 180.875, 144, 426, 145.5, 426.0, 426.0, 426.0, 0.035529342795981626, 0.009506874927831022, 0.020262828313333276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 167.3157894736842, 139, 530, 147.0, 163.0, 530.0, 530.0, 0.11161632183097764, 0.08294923917321678, 0.05602616154406495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 181.875, 144, 426, 147.0, 426.0, 426.0, 426.0, 0.03552808050663043, 0.026403192642134525, 0.017833431035554726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 208.578947368421, 142, 455, 148.0, 445.0, 455.0, 455.0, 0.11161632183097764, 0.04751266331230247, 0.06266944385699012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 152.5, 149, 156, 152.0, 156.0, 156.0, 156.0, 0.03543130976265451, 0.027888316082714394, 0.012594723392193597], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 713.5384615384615, 150, 1638, 510.0, 1586.8, 1638.0, 1638.0, 0.08782062974146958, 0.017040316002269826, 0.059763152405947484], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1524.6666666666667, 1021, 2991, 1506.0, 2021.8000000000002, 2898.8999999999987, 2991.0, 0.0886783130851185, 0.0458979550147586, 0.04078856002254963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 405.75, 294, 870, 299.5, 870.0, 870.0, 870.0, 0.03550458674880061, 0.05502517497104157, 0.07985064773680449], "isController": false}, {"data": ["addBook", 61, 12, 19.672131147540984, 1418.393442622951, 749, 2841, 1163.0, 2594.6, 2698.0, 2841.0, 0.2853734415569226, 79.45105633493954, 1.039294036981591], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b9693db3-56da-45a2-9316-af5028b92812", 3, 0, 0.0, 630.6666666666666, 245, 1039, 608.0, 1039.0, 1039.0, 1039.0, 0.029547334830398297, 0.029633899287909233, 0.01894799792183745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a620ffa-5057-4c2e-aa64-6f84a5fbfc7f", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=064b980f-512f-414f-8309-d42a5bcaffa9", 1, 0, 0.0, 789.0, 789, 789, 789.0, 789.0, 789.0, 789.0, 1.2674271229404308, 0.2289785329531052, 0.8738315906210392], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 254.35714285714286, 143, 606, 151.5, 585.1, 599.0, 606.0, 0.24778870702967715, 0.18414766215779715, 0.11978067380829119], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 932.8928571428571, 683, 1289, 879.0, 1182.2, 1252.35, 1289.0, 0.24752475247524752, 72.7804958230198, 0.12448754641089109], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 234.2142857142857, 139, 598, 150.5, 447.3, 472.1999999999998, 598.0, 0.2483249154143257, 0.43941869797925603, 0.12076739050423262], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1414.3571428571431, 986, 2231, 1415.5, 1760.9, 1785.6999999999998, 2231.0, 0.24688092404002998, 222.14388942159326, 0.12392265132478067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 156.21428571428572, 150, 171, 154.5, 168.0, 171.0, 171.0, 0.07205426715663568, 0.053829603881666306, 0.02561304027833534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, 6.741573033707865, 218.8089887640449, 141, 812, 156.0, 429.29999999999995, 505.24999999999955, 804.8900000000001, 0.726761989531361, 1.5258245801214265, 0.3502510174157487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 159.20000000000002, 150, 174, 157.5, 173.7, 174.0, 174.0, 0.04859676831490706, 0.03763402077511845, 0.01727463248693962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 183.44444444444446, 144, 440, 152.0, 416.6, 440.0, 440.0, 0.0963128240525226, 0.07816011405043582, 0.03423619917492014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9693db3-56da-45a2-9316-af5028b92812", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 0.24546747622282608, 0.9367569633152174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 537.5, 299, 899, 458.0, 898.2, 899.0, 899.0, 0.04762471722824146, 0.07380901000119063, 0.10710910525062507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 570.1052631578947, 289, 2018, 301.0, 1910.0, 2018.0, 2018.0, 0.11151739964901365, 14.198172242658925, 0.2478017957969679], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eefe1c55-a2b2-49fa-ad91-5cdebf0671d8", 3, 0, 0.0, 450.3333333333333, 415, 472, 464.0, 472.0, 472.0, 472.0, 0.017995645053896957, 0.024808449480225786, 0.011540176027401369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5504c1c7-44be-48a7-ad28-26565b95b33d", 3, 0, 0.0, 766.6666666666667, 317, 1510, 473.0, 1510.0, 1510.0, 1510.0, 0.05759373380176237, 0.02605966470847972, 0.036933481637197875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 158.5, 146, 208, 152.5, 197.0, 208.0, 208.0, 0.08834758464014135, 0.0732491204682422, 0.03140480547755025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=859b5465-3e76-4224-a78b-427371abb39b", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 179.42857142857144, 145, 448, 152.0, 376.8000000000002, 446.09999999999997, 448.0, 0.10233269822087294, 0.07944774910702539, 0.03637607632070093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f360f630-143d-4150-a837-ae16bcd77280", 3, 0, 0.0, 428.0, 242, 788, 254.0, 788.0, 788.0, 788.0, 0.07946598855689765, 0.035956290395210845, 0.05095963458889595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b341b88-f8cf-488c-98cd-39b78bd3376f", 3, 0, 0.0, 577.3333333333334, 229, 790, 713.0, 790.0, 790.0, 790.0, 0.019751135690302193, 0.027228535041806574, 0.012665930113898216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e8c13b6-d2eb-4cab-94fe-1d8e7237c5dd", 2, 0, 0.0, 311.5, 245, 378, 311.5, 378.0, 378.0, 378.0, 0.13421017313112335, 0.07896643487451349, 0.08342263202925783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b823e881-e074-49a8-8677-d6c72dcebce3", 3, 0, 0.0, 452.6666666666667, 236, 665, 457.0, 665.0, 665.0, 665.0, 0.02886363855027565, 0.02378055637068609, 0.018509559877618174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 148.28571428571428, 144, 152, 149.0, 151.5, 152.0, 152.0, 0.07312079555425563, 0.05434074747733256, 0.03670321183094472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcf4dfca-69e5-4822-8be7-4521202bf6b4", 2, 0, 0.0, 246.5, 228, 265, 246.5, 265.0, 265.0, 265.0, 0.015088418130243225, 0.025520644728106705, 0.009378689589745911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 226.85714285714286, 142, 443, 148.0, 437.0, 443.0, 443.0, 0.07312232320066855, 0.01956593413767889, 0.04170257495038128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 230.57142857142856, 143, 444, 148.5, 444.0, 444.0, 444.0, 0.0731227051222455, 0.01970885411498023, 0.0429881528160076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 270.0, 138, 445, 154.5, 444.5, 445.0, 445.0, 0.07312614259597806, 0.019709780621572213, 0.04306158592321755], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 29.032258064516128, 0.67618332081142], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.22539444027047334], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.15026296018031554], "isController": false}, {"data": ["401/Unauthorized", 17, 54.83870967741935, 1.2772351615326822], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1331, 31, "401/Unauthorized", 17, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

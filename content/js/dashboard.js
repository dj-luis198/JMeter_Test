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

    var data = {"OkPercent": 97.03196347031964, "KoPercent": 2.9680365296803655};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.708989501312336, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80702ebb-d67d-4cd8-9b1e-0067ff90d3f0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2606404d-ab17-4e54-b054-e95ef3f2efa2"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ed1b7dc-ca28-4926-8655-4929ec3247fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2606404d-ab17-4e54-b054-e95ef3f2efa2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.38461538461538464, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e9523055-92e2-4a7a-a9ee-3075ad22518b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2ff32ae-0d47-4732-9ff9-a865cbb0e76d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a2ff32ae-0d47-4732-9ff9-a865cbb0e76d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9523055-92e2-4a7a-a9ee-3075ad22518b"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b799c2c-0239-4f89-b0d0-62d3ea64bdf6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a19bc94e-5d29-410d-b050-833dc622c47b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.21774193548387097, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a19bc94e-5d29-410d-b050-833dc622c47b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.3425925925925926, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8764044943820225, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f2d810d4-9786-4404-aacd-22f0c84032c9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b799c2c-0239-4f89-b0d0-62d3ea64bdf6"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a84d4d68-fe21-4829-876b-c1d2b41bae63"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2624f3e0-ca96-4201-88ce-7b5143c1f6bd"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/a84d4d68-fe21-4829-876b-c1d2b41bae63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8a0ed31-aa07-4cba-979d-6ddd4aadaf03"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/69eceb9d-4be2-4679-8e26-d7f41d4046b0"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb2bacf6-052d-4dce-86b5-0b97c56f530e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1715590f-80bd-48ee-829f-29e2d6f37b74"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1715590f-80bd-48ee-829f-29e2d6f37b74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80702ebb-d67d-4cd8-9b1e-0067ff90d3f0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69eceb9d-4be2-4679-8e26-d7f41d4046b0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb2bacf6-052d-4dce-86b5-0b97c56f530e"], "isController": false}, {"data": [0.11538461538461539, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 39, 2.9680365296803655, 487.67199391171914, 138, 4018, 158.0, 1415.0, 1704.25, 2126.899999999997, 5.082778895249884, 706.6757483100921, 3.723981250241761], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2423.296296296296, 1889, 3189, 2439.5, 2871.5, 3036.75, 3189.0, 0.2454043491104092, 295.3051328989525, 1.2066512673544048], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 411.7058823529411, 285, 1450, 292.0, 753.1999999999994, 1450.0, 1450.0, 0.09635276447416896, 6.921214788732394, 0.2152494633292714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 148.31250000000003, 144, 158, 147.5, 154.5, 158.0, 158.0, 0.09265801086415178, 0.07193663929394596, 0.03293702729936645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80702ebb-d67d-4cd8-9b1e-0067ff90d3f0", 3, 0, 0.0, 404.0, 261, 491, 460.0, 491.0, 491.0, 491.0, 0.029856985041650495, 0.024890539938693657, 0.019146569183610507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2606404d-ab17-4e54-b054-e95ef3f2efa2", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 707.6666666666667, 291, 1726, 575.0, 1679.8000000000002, 1726.0, 1726.0, 0.07677444946321864, 15.407309947249557, 0.16939362580133333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ed1b7dc-ca28-4926-8655-4929ec3247fe", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 205.57142857142856, 139, 432, 145.0, 430.0, 432.0, 432.0, 0.077076382695251, 0.05728039768660743, 0.03868873115757716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 224.2857142857143, 142, 426, 146.0, 426.0, 426.0, 426.0, 0.07707808009513636, 0.028893526955305726, 0.04349621009832961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2606404d-ab17-4e54-b054-e95ef3f2efa2", 3, 0, 0.0, 370.3333333333333, 241, 547, 323.0, 547.0, 547.0, 547.0, 0.03440130266266083, 0.028477380426805494, 0.022060731199688093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 326.7142857142857, 142, 1278, 146.0, 856.0, 1278.0, 1278.0, 0.07695436606092587, 4.965236766940954, 0.044768374229082156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 283.14285714285717, 141, 1111, 144.5, 842.0, 1111.0, 1111.0, 0.07707850445678924, 1.6381225293586517, 0.044915863994978884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 154.0, 149, 159, 154.0, 159.0, 159.0, 159.0, 0.0213736868541139, 0.006303567802678123, 0.013212445096341894], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1641.3888888888887, 1130, 2587, 1562.0, 2261.0, 2437.5, 2587.0, 0.2461246758218969, 294.4506790648174, 0.4860000922967534], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 546.1538461538462, 147, 1127, 551.0, 1061.3999999999999, 1127.0, 1127.0, 0.08169523905283797, 0.01691346746015786, 0.05462509936968982], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 546.1538461538462, 147, 1127, 551.0, 1061.3999999999999, 1127.0, 1127.0, 0.07880172878869621, 0.01631442041328476, 0.05269036868601148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 1372.5909090909088, 169, 2490, 1409.5, 2307.0, 2476.95, 2490.0, 0.09400504208862111, 0.02927642823569628, 0.042412431098577105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 208.0, 139, 431, 147.0, 431.0, 431.0, 431.0, 0.05148152385310605, 0.013875879476032492, 0.030315780159592725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 193.99999999999997, 140, 431, 144.0, 427.8, 431.0, 431.0, 0.11259098344912544, 0.0400743183278252, 0.06365581681446993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 250.11111111111111, 138, 504, 146.0, 504.0, 504.0, 504.0, 0.05148181833782369, 0.013875958848866542, 0.030265678358759634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 145.05882352941177, 139, 154, 145.0, 150.0, 154.0, 154.0, 0.11259023776409033, 0.08367301849460229, 0.056515021690178156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 235.3529411764706, 142, 1136, 143.0, 571.1999999999995, 1136.0, 1136.0, 0.11259172914403794, 1.9759563880904443, 0.06573240712838106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 220.58823529411762, 142, 1148, 145.0, 575.9999999999995, 1148.0, 1148.0, 0.11259172914403794, 5.9879875076992874, 0.06562245426788883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 322.625, 141, 1565, 147.5, 772.6000000000008, 1565.0, 1565.0, 0.09215581243988273, 5.205909068491928, 0.05368256066444341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 342.87499999999994, 142, 1156, 289.0, 755.6000000000004, 1156.0, 1156.0, 0.09192338186121868, 1.7125106106872423, 0.053636934240310706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9523055-92e2-4a7a-a9ee-3075ad22518b", 3, 0, 0.0, 347.0, 259, 509, 273.0, 509.0, 509.0, 509.0, 0.08549931600547195, 0.038686213947788414, 0.054828662933196534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 208.2222222222222, 142, 429, 144.0, 429.0, 429.0, 429.0, 0.051480640419166813, 0.01377509323715987, 0.02936005273905607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 181.5, 143, 433, 145.5, 432.3, 433.0, 433.0, 0.09215528164957953, 0.06848649349153323, 0.04625763160926161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2ff32ae-0d47-4732-9ff9-a865cbb0e76d", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 0.6869355988593155, 2.6214947718631176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 178.11111111111111, 139, 445, 146.0, 445.0, 445.0, 445.0, 0.05147857919121432, 0.0382570300434708, 0.02583983369559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 180.0625, 141, 428, 144.5, 423.1, 428.0, 428.0, 0.09215634323630038, 0.03330992826204656, 0.05207418369639093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2ff32ae-0d47-4732-9ff9-a865cbb0e76d", 3, 0, 0.0, 427.0, 259, 512, 510.0, 512.0, 512.0, 512.0, 0.05906674542232723, 0.027418352530025596, 0.03787808869856271], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 150.33333333333334, 147, 158, 149.0, 158.0, 158.0, 158.0, 0.05138804828192625, 0.0404480145656568, 0.018266845287715973], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 689.5000000000001, 144, 2385, 557.5, 1933.2000000000016, 2385.0, 2385.0, 0.08898974393201182, 0.017366325353919625, 0.060557636617796465], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9523055-92e2-4a7a-a9ee-3075ad22518b", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1692.3636363636365, 1156, 4018, 1563.5, 2006.5, 3717.399999999996, 4018.0, 0.09443519170343916, 0.048877589455881595, 0.0434364993089061], "isController": false}, {"data": ["goToProfile", 13, 3, 23.076923076923077, 311.2307692307692, 144, 674, 261.0, 601.1999999999999, 674.0, 674.0, 0.08191969349431603, 0.1227380023095052, 0.052941340379477224], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 462.22222222222223, 282, 878, 316.0, 878.0, 878.0, 878.0, 0.0514365073468478, 0.07971654019477291, 0.11568191056620164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b799c2c-0239-4f89-b0d0-62d3ea64bdf6", 3, 0, 0.0, 392.0, 262, 595, 319.0, 595.0, 595.0, 595.0, 0.037695071997587516, 0.03142483052923881, 0.02417294656095293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a19bc94e-5d29-410d-b050-833dc622c47b", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 144.70588235294116, 141, 149, 144.0, 147.4, 149.0, 149.0, 0.09643310945725177, 0.07166562138375838, 0.04840490064553458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 959.25, 850, 1140, 859.0, 1140.0, 1140.0, 1140.0, 0.03766762091306313, 11.07553123116619, 0.021482315051981317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 179.29411764705878, 139, 433, 144.0, 429.8, 433.0, 433.0, 0.09643475054599086, 0.03432385767365346, 0.05452153118529654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1481.3749999999998, 1129, 1741, 1505.5, 1741.0, 1741.0, 1741.0, 0.037616788372650714, 33.84765230097192, 0.021416589473882194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 250.375, 143, 428, 148.0, 428.0, 428.0, 428.0, 0.03784527903797301, 0.06696840392266318, 0.020955344936065132], "isController": false}, {"data": ["addBook", 62, 21, 33.87096774193548, 1319.370967741935, 737, 2738, 1030.0, 2409.1, 2551.8999999999996, 2738.0, 0.2984313102578543, 81.80379295816427, 1.085221430316289], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 223.33333333333334, 142, 443, 146.0, 439.4, 443.0, 443.0, 0.07272339414625159, 0.05404541303251705, 0.03650373495231769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 163.06666666666666, 139, 430, 144.0, 260.2000000000001, 430.0, 430.0, 0.07272480449148393, 0.019459566826822847, 0.041475865061549426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 258.79999999999995, 142, 433, 146.0, 431.8, 433.0, 433.0, 0.07272409931203003, 0.019601417392695594, 0.042753816197111404], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 250.20370370370364, 142, 587, 147.0, 578.5, 584.0, 587.0, 0.24749071909803383, 0.18392620823594116, 0.11963662690774096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 221.1333333333333, 140, 434, 145.0, 434.0, 434.0, 434.0, 0.07272515708633931, 0.01960170249592739, 0.04282545871392832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a19bc94e-5d29-410d-b050-833dc622c47b", 3, 0, 0.0, 403.33333333333337, 244, 706, 260.0, 706.0, 706.0, 706.0, 0.05387060281204547, 0.02437504489216901, 0.03454592693350572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 146.125, 144, 148, 146.0, 148.0, 148.0, 148.0, 0.037844741946165855, 0.028124852168976776, 0.021250709588911492], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 918.5370370370371, 698, 1302, 855.5, 1199.5, 1288.75, 1302.0, 0.24717578775839025, 72.67788860954465, 0.12431204169489354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 965.9375, 139, 1870, 995.0, 1853.2, 1870.0, 1870.0, 0.07500644586644165, 33.75557420950238, 0.04087265311862738], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 220.7592592592592, 141, 586, 148.0, 431.0, 472.0, 586.0, 0.24800448245138654, 0.4388516818378051, 0.12061155494217822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 263.0588235294117, 142, 1300, 145.0, 607.1999999999994, 1300.0, 1300.0, 0.09643365648062534, 5.128649632772127, 0.0562049562645005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 666.5, 142, 1295, 640.5, 1270.5, 1295.0, 1295.0, 0.07500503940108476, 11.03709409382193, 0.040945133813678106], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1389.2407407407406, 985, 2098, 1414.0, 1760.5, 1915.25, 2098.0, 0.24683006207318972, 222.09812373442458, 0.12389712100158154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 214.6470588235294, 139, 1300, 145.0, 400.7999999999992, 1300.0, 1300.0, 0.09643365648062534, 1.6923862969192283, 0.05629912975715736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 175.25, 146, 438, 150.5, 355.2000000000003, 438.0, 438.0, 0.07563867405404383, 0.05650740786264017, 0.026887184917648393], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 637.5, 149, 1291, 602.0, 1248.1000000000001, 1291.0, 1291.0, 0.08860862309583761, 0.017695765061619913, 0.06003868781705273], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 21, 11.797752808988765, 200.37640449438203, 141, 540, 151.0, 363.7999999999999, 425.3499999999999, 521.8300000000002, 0.7550082923663571, 1.5861586275603476, 0.3639632726110138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 173.5, 140, 444, 148.5, 315.0, 444.0, 444.0, 0.07473402693627858, 0.05787508140670792, 0.026565611137505274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 483.6000000000001, 286, 877, 294.0, 874.0, 877.0, 877.0, 0.07267301021298037, 0.11262897188281235, 0.16344330324266973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 182.52941176470588, 144, 440, 149.0, 430.4, 440.0, 440.0, 0.11668531343734342, 0.09469286666643786, 0.04147798251093067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 677.6363636363636, 181, 1466, 611.5, 1321.5, 1444.5499999999997, 1466.0, 0.0958760235855018, 0.05889259651882874, 0.04335019425789779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 146.75, 142, 155, 146.5, 154.3, 155.0, 155.0, 0.0750004687529297, 0.05573765304783155, 0.03764671966699792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 196.5, 141, 425, 145.0, 424.3, 425.0, 425.0, 0.07500433618818587, 0.07639601820730262, 0.03962631433379742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2d810d4-9786-4404-aacd-22f0c84032c9", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.605950545540797, 1.1322195208728651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b799c2c-0239-4f89-b0d0-62d3ea64bdf6", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["login", 22, 0, 0.0, 3279.0, 1739, 5739, 3036.5, 4633.9, 5577.149999999998, 5739.0, 0.09312090479657316, 40.63522147431556, 0.196650120951357], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 563.7857142857142, 290, 1417, 430.0, 1209.0, 1417.0, 1417.0, 0.07689223553190204, 6.681359219585001, 0.17152718277833615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 170.0588235294118, 145, 448, 149.0, 223.9999999999998, 448.0, 448.0, 0.09367423407538021, 0.0758358789536037, 0.03329826289398281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a84d4d68-fe21-4829-876b-c1d2b41bae63", 1, 0, 0.0, 1291.0, 1291, 1291, 1291.0, 1291.0, 1291.0, 1291.0, 0.774593338497289, 0.13994117931835787, 0.5340457978311387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 569.8125, 288, 1711, 573.5, 1120.2000000000007, 1711.0, 1711.0, 0.09184581384001607, 7.000916888507792, 0.20509466217961594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2624f3e0-ca96-4201-88ce-7b5143c1f6bd", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a84d4d68-fe21-4829-876b-c1d2b41bae63", 3, 0, 0.0, 1167.6666666666667, 674, 1950, 879.0, 1950.0, 1950.0, 1950.0, 0.02757276913320405, 0.027653548730273984, 0.01768175624752994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 153.00000000000003, 147, 173, 150.0, 170.0, 173.0, 173.0, 0.07192657734984127, 0.05963443766603052, 0.025567650542326393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8a0ed31-aa07-4cba-979d-6ddd4aadaf03", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.1871224442379182, 2.218140102230483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69eceb9d-4be2-4679-8e26-d7f41d4046b0", 3, 0, 0.0, 825.0, 489, 1191, 795.0, 1191.0, 1191.0, 1191.0, 0.025561065385205254, 0.025635951318950974, 0.016391698831007277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1132.1875000000002, 292, 2027, 1140.5, 2003.2, 2027.0, 2027.0, 0.07494917509064165, 44.890713270219884, 0.1589742268524157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb2bacf6-052d-4dce-86b5-0b97c56f530e", 3, 0, 0.0, 441.3333333333333, 264, 568, 492.0, 568.0, 568.0, 568.0, 0.02324338144713293, 0.03204287774368749, 0.014905423649365845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1715590f-80bd-48ee-829f-29e2d6f37b74", 3, 0, 0.0, 974.0, 246, 2385, 291.0, 2385.0, 2385.0, 2385.0, 0.0398702886608899, 0.02563275394051353, 0.02556786089256286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1715590f-80bd-48ee-829f-29e2d6f37b74", 1, 0, 0.0, 863.0, 863, 863, 863.0, 863.0, 863.0, 863.0, 1.1587485515643106, 0.20934422074159909, 0.7989028099652375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 150.31249999999997, 146, 156, 149.5, 154.6, 156.0, 156.0, 0.07279974156091745, 0.056519330606376345, 0.025878033132982377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80702ebb-d67d-4cd8-9b1e-0067ff90d3f0", 1, 0, 0.0, 1082.0, 1082, 1082, 1082.0, 1082.0, 1082.0, 1082.0, 0.9242144177449169, 0.16697233133086875, 0.6372025184842883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69eceb9d-4be2-4679-8e26-d7f41d4046b0", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.2566250887784091, 0.9793368252840909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb2bacf6-052d-4dce-86b5-0b97c56f530e", 1, 0, 0.0, 1148.0, 1148, 1148, 1148.0, 1148.0, 1148.0, 1148.0, 0.8710801393728222, 0.1573728767421603, 0.6005689242160279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 1058.2307692307693, 144, 1887, 1427.0, 1877.0, 1887.0, 1887.0, 0.06108505859466775, 44.97795835232452, 0.10024979530631807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 433.8235294117647, 287, 1292, 294.0, 719.9999999999995, 1292.0, 1292.0, 0.11248296213955827, 8.079879651501317, 0.25128388756004605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 168.91666666666666, 142, 435, 145.0, 348.9000000000003, 435.0, 435.0, 0.07698723295053571, 0.05721414480015397, 0.03864398216462436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 262.6666666666667, 141, 436, 146.5, 434.5, 436.0, 436.0, 0.07699019658163526, 0.03987350350305394, 0.04283080923112457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 442.5833333333333, 142, 1579, 147.5, 1533.4, 1579.0, 1579.0, 0.07684770705654069, 11.541877697674717, 0.04407736322709138], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 1372.5909090909088, 169, 2490, 1409.5, 2307.0, 2476.95, 2490.0, 0.09389310696558818, 0.029241567758814216, 0.04236192911923998], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 429.9166666666667, 141, 1144, 430.0, 1060.9000000000003, 1144.0, 1144.0, 0.07684721492885228, 3.783199397709953, 0.044152127066869884], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 20.512820512820515, 0.60882800608828], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.6923076923076925, 0.228310502283105], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.128205128205129, 0.15220700152207], "isController": false}, {"data": ["401/Unauthorized", 26, 66.66666666666667, 1.97869101978691], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 39, "401/Unauthorized", 26, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 21, "401/Unauthorized", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

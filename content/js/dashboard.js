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

    var data = {"OkPercent": 98.50863422291994, "KoPercent": 1.4913657770800628};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7903768506056528, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d63430d-ae93-4e0c-8893-2cf987182642"], "isController": false}, {"data": [0.37037037037037035, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82f46e6d-7662-45c4-b1b6-b4276b9cba72"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02e7e1c8-62f9-498f-963f-e206e51e4c19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c71ff52c-64b8-49c8-81d8-a733f37891ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c6303ef-d88d-49cf-8be5-192b847a08ad"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a120fcb1-5f9e-4922-a250-d8ccefd91c88"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c8f69fa-4f4f-40c9-840e-24948e49ce64"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6325dc1a-fe68-4131-9d2a-acd9d667e600"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be8749d1-77b0-420d-9b5a-d338bab0510e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0390ff9b-214e-49d5-9d74-71551082105d"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b35d992e-ec18-426a-8dd0-9286a5065c73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/be8749d1-77b0-420d-9b5a-d338bab0510e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.48148148148148145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/541d285c-d09f-4832-a8e2-d2335cd86da1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09d80e10-96e8-48a0-bdb5-8afe2f36cfa0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/08e4df3e-58f7-44ec-9c74-098f1e943220"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7708f79d-3548-4dfc-8565-fd60e9a1322b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8148148148148148, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c71ff52c-64b8-49c8-81d8-a733f37891ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a120fcb1-5f9e-4922-a250-d8ccefd91c88"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7708f79d-3548-4dfc-8565-fd60e9a1322b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1c8f69fa-4f4f-40c9-840e-24948e49ce64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02e7e1c8-62f9-498f-963f-e206e51e4c19"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c6303ef-d88d-49cf-8be5-192b847a08ad"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82f46e6d-7662-45c4-b1b6-b4276b9cba72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d63430d-ae93-4e0c-8893-2cf987182642"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0390ff9b-214e-49d5-9d74-71551082105d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b35d992e-ec18-426a-8dd0-9286a5065c73"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6325dc1a-fe68-4131-9d2a-acd9d667e600"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4676048a-850c-4f8d-a984-8bea358ddbe1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1274, 19, 1.4913657770800628, 335.9529042386185, 79, 2856, 100.5, 888.5, 1189.25, 1987.25, 4.975746166644535, 704.0732239486101, 3.631411820375173], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d63430d-ae93-4e0c-8893-2cf987182642", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1378.1666666666672, 973, 1858, 1330.0, 1764.0, 1820.25, 1858.0, 0.24770869457517958, 298.0779926880063, 1.2179817160019817], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/82f46e6d-7662-45c4-b1b6-b4276b9cba72", 3, 0, 0.0, 441.66666666666663, 196, 902, 227.0, 902.0, 902.0, 902.0, 0.028920122621319915, 0.029004849543062063, 0.01854578175911466], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 735.7857142857143, 86, 1530, 624.0, 1515.0, 1530.0, 1530.0, 0.07418908678533387, 0.014614256492869898, 0.049918242963960004], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 735.7857142857143, 86, 1530, 624.0, 1515.0, 1530.0, 1530.0, 0.07357655640694143, 0.01449359621185844, 0.04950610094177992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 124.73684210526316, 80, 249, 82.0, 248.0, 249.0, 249.0, 0.10442257066385276, 0.027941195665913725, 0.059553497331728524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 107.84210526315789, 80, 248, 84.0, 243.0, 248.0, 248.0, 0.10442257066385276, 0.07760310183124214, 0.05241523566525421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 124.57894736842104, 80, 250, 82.0, 243.0, 250.0, 250.0, 0.104423718473655, 0.028145455369852326, 0.06149170140587301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 107.10526315789474, 80, 242, 82.0, 240.0, 242.0, 242.0, 0.10442429238801869, 0.028145610057708163, 0.061390062517175055], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 292.0, 81, 642, 240.5, 589.0, 642.0, 642.0, 0.07348155612941153, 0.1407046733613613, 0.04749442655518465], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 107.0, 80, 262, 84.0, 250.6, 262.0, 262.0, 0.08841732979664015, 0.06570858200707339, 0.04438135499557913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 103.33333333333336, 79, 243, 82.0, 240.6, 243.0, 243.0, 0.08841941454558316, 0.04136600995602608, 0.049436584122231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 576.6, 480, 643, 639.0, 643.0, 643.0, 643.0, 0.06398362019323053, 18.813308792949005, 0.03649065839145179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 867.6, 724, 945, 886.0, 945.0, 945.0, 945.0, 0.0637820185733238, 57.39117242910629, 0.03631339534008572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 211.4, 83, 250, 241.0, 250.0, 250.0, 250.0, 0.06444212452796143, 0.11403235316861926, 0.03568230918686927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 83.75, 81, 97, 82.5, 90.7, 97.0, 97.0, 0.0779203070060096, 0.05790757190583331, 0.039112341602625916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 92.06249999999999, 79, 237, 81.0, 139.7000000000001, 237.0, 237.0, 0.07791575359142927, 0.02084855125395666, 0.044436328220112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 111.0, 79, 242, 81.5, 241.3, 242.0, 242.0, 0.07786153299625778, 0.020986116315397606, 0.04577406529662811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02e7e1c8-62f9-498f-963f-e206e51e4c19", 3, 0, 0.0, 496.66666666666663, 201, 850, 439.0, 850.0, 850.0, 850.0, 0.06258083357670324, 0.028316197484250488, 0.040131589240268675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 121.8125, 80, 247, 82.0, 243.5, 247.0, 247.0, 0.0778588807785888, 0.020985401459854013, 0.045848540145985404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c71ff52c-64b8-49c8-81d8-a733f37891ba", 3, 0, 0.0, 640.3333333333334, 221, 1117, 583.0, 1117.0, 1117.0, 1117.0, 0.026870404041308766, 0.026949125928148538, 0.01723134634159449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 82.2, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.06444212452796143, 0.04789107106033072, 0.036185763284743974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 598.1176470588235, 80, 1372, 745.0, 1108.7999999999997, 1372.0, 1372.0, 0.09379983116030391, 49.65820608857463, 0.050402321959644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 177.46666666666667, 80, 956, 82.0, 759.8000000000002, 956.0, 956.0, 0.08841837215882298, 10.628521537978639, 0.05096720488894652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 432.2941176470588, 80, 748, 564.0, 729.6, 748.0, 748.0, 0.09379983116030391, 16.2340954109812, 0.05049392335726149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 161.26666666666668, 80, 636, 82.0, 588.6, 636.0, 636.0, 0.08841941454558316, 3.487086712919845, 0.05105415283885267], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 526.2857142857143, 83, 1306, 473.5, 1172.0, 1306.0, 1306.0, 0.07412898443291327, 0.014602417134385258, 0.05035351914116276], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 217.06249999999997, 164, 335, 168.5, 328.7, 335.0, 335.0, 0.0778266896903957, 0.12061616849478317, 0.17503404917673954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 619.9523809523808, 107, 1275, 589.0, 1139.4, 1263.3999999999999, 1275.0, 0.08877540667591059, 0.05453098710854273, 0.04013966141694004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 83.35294117647061, 81, 86, 83.0, 86.0, 86.0, 86.0, 0.09379672594251916, 0.06970635590064168, 0.047081559701616066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 130.94117647058823, 79, 262, 82.0, 258.0, 262.0, 262.0, 0.09380034871659051, 0.10797170195215079, 0.048861532752874706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c6303ef-d88d-49cf-8be5-192b847a08ad", 1, 0, 0.0, 1306.0, 1306, 1306, 1306.0, 1306.0, 1306.0, 1306.0, 0.7656967840735069, 0.13833389165390506, 0.5279120405819295], "isController": false}, {"data": ["login", 21, 0, 0.0, 3178.190476190476, 2005, 4661, 3110.0, 4478.4, 4643.8, 4661.0, 0.08915645259211773, 25.518343774279213, 0.16971816345137364], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 86.66666666666667, 81, 106, 85.0, 99.4, 106.0, 106.0, 0.09080672696233337, 0.0735144303239984, 0.03227895372489194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a120fcb1-5f9e-4922-a250-d8ccefd91c88", 3, 0, 0.0, 514.6666666666666, 239, 663, 642.0, 663.0, 663.0, 663.0, 0.022577100799229366, 0.022643244649227113, 0.014478153832839147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c8f69fa-4f4f-40c9-840e-24948e49ce64", 1, 0, 0.0, 1038.0, 1038, 1038, 1038.0, 1038.0, 1038.0, 1038.0, 0.9633911368015414, 0.17405015655105974, 0.6642130298651252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 682.470588235294, 164, 1456, 832.0, 1193.5999999999997, 1456.0, 1456.0, 0.09375430856197435, 66.03791642251483, 0.1967450968564732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 276.0, 164, 493, 321.0, 490.0, 493.0, 493.0, 0.10437495879935836, 0.16176080040486496, 0.23474172862785384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 564.4444444444445, 81, 1028, 807.0, 1028.0, 1028.0, 1028.0, 0.11468620579802485, 76.23840195922268, 0.1774425573431029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6325dc1a-fe68-4131-9d2a-acd9d667e600", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 0.5827872983870968, 2.2240423387096775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be8749d1-77b0-420d-9b5a-d338bab0510e", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 0.6617731227106226, 2.525469322344322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0390ff9b-214e-49d5-9d74-71551082105d", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1436.5652173913045, 270, 2481, 1545.0, 2303.0000000000005, 2458.9999999999995, 2481.0, 0.09383963214864198, 0.029563946609329293, 0.04233780278581308], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b35d992e-ec18-426a-8dd0-9286a5065c73", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 96.94736842105262, 82, 247, 85.0, 103.0, 247.0, 247.0, 0.09260387474107469, 0.07189460978433045, 0.032917783599366396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 307.53333333333336, 162, 1200, 172.0, 912.6000000000001, 1200.0, 1200.0, 0.08837461409751844, 14.215603265368346, 0.19574171524815592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be8749d1-77b0-420d-9b5a-d338bab0510e", 3, 0, 0.0, 541.3333333333334, 507, 581, 536.0, 581.0, 581.0, 581.0, 0.0860634574559642, 0.03894147326295255, 0.05519043332950829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 296.80000000000007, 165, 500, 323.0, 401.00000000000006, 500.0, 500.0, 0.0876649562259652, 0.13586356008848316, 0.19716054119960727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 108.85714285714285, 81, 242, 87.0, 242.0, 242.0, 242.0, 0.03561706566260463, 0.02646932321215051, 0.017878097412674588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 105.42857142857143, 81, 238, 83.0, 238.0, 238.0, 238.0, 0.0355909883617468, 0.009523369932733032, 0.020297985550058725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 82.71428571428572, 80, 86, 83.0, 86.0, 86.0, 86.0, 0.03561978424587828, 0.009600644972521881, 0.020940537222674537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 106.85714285714286, 80, 250, 82.0, 250.0, 250.0, 250.0, 0.035588997915501554, 0.009592347094412527, 0.020957193108444763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 84.0, 83, 85, 84.0, 85.0, 85.0, 85.0, 0.16633399866932802, 0.049055534763805725, 0.10282170034930141], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 956.351851851852, 639, 1521, 854.0, 1391.0, 1473.5, 1521.0, 0.25245323771277367, 302.0218392504009, 0.4984965299367464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1436.5652173913045, 270, 2481, 1545.0, 2303.0000000000005, 2458.9999999999995, 2481.0, 0.09038748722785507, 0.028476356794781103, 0.04078029208912992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/541d285c-d09f-4832-a8e2-d2335cd86da1", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 121.5, 82, 238, 83.0, 238.0, 238.0, 238.0, 0.11697616610615587, 0.031528732270799824, 0.06888342593946484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 81.25, 81, 82, 81.0, 82.0, 82.0, 82.0, 0.11751571772724602, 0.03167415829367178, 0.06908638874199424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 305.7368421052632, 79, 1128, 83.0, 1114.0, 1128.0, 1128.0, 0.09113015784702604, 17.282354803278768, 0.0519258290446202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 216.2105263157895, 80, 671, 88.0, 582.0, 671.0, 671.0, 0.09113103203495596, 5.660559838314363, 0.05201532230408027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 95.15789473684211, 79, 246, 83.0, 130.0, 246.0, 246.0, 0.09110918236701655, 0.06770907009892539, 0.045732538805318856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 81.5, 79, 83, 82.0, 83.0, 83.0, 83.0, 0.1175226231049477, 0.031446483135503585, 0.06702462098954048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 100.26315789473684, 80, 250, 82.0, 248.0, 250.0, 250.0, 0.09113059493889454, 0.053200107797901124, 0.05036164457149435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 82.25, 81, 83, 82.5, 83.0, 83.0, 83.0, 0.11751226534269514, 0.08733089250565527, 0.05898564881459502], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 666.2142857142857, 82, 1779, 582.0, 1356.5, 1779.0, 1779.0, 0.07577930900095806, 0.014631496045943911, 0.05156968042782832], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 162.25, 82, 241, 163.0, 241.0, 241.0, 241.0, 0.11956716685598134, 0.0941124379745322, 0.042502391343337116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09d80e10-96e8-48a0-bdb5-8afe2f36cfa0", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 1.6985954122340425, 3.173828125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08e4df3e-58f7-44ec-9c74-098f1e943220", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.5458733974358975, 1.019965277777778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1999.6666666666665, 1447, 2856, 1974.0, 2664.0, 2839.2999999999997, 2856.0, 0.08769841766997832, 0.04539078258309425, 0.040337846408749795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 205.0, 166, 320, 167.0, 320.0, 320.0, 320.0, 0.11669292257424586, 0.1808512384036408, 0.2624451178598518], "isController": false}, {"data": ["addBook", 58, 5, 8.620689655172415, 963.5172413793102, 428, 2006, 781.0, 1655.9, 1908.9999999999998, 2006.0, 0.2767017155506364, 92.38099925397879, 1.0052753346063203], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7708f79d-3548-4dfc-8565-fd60e9a1322b", 3, 0, 0.0, 835.3333333333333, 251, 1779, 476.0, 1779.0, 1779.0, 1779.0, 0.021105506426626706, 0.021167338964985963, 0.013534455618637569], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 149.83333333333334, 81, 371, 85.0, 335.0, 367.5, 371.0, 0.25329755896204287, 0.18824164293956508, 0.12244364422481566], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 529.9444444444442, 397, 747, 487.0, 652.0, 729.75, 747.0, 0.25324529151346886, 74.46252424002964, 0.12736457532171533], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 136.31481481481478, 79, 369, 86.0, 247.0, 274.75, 369.0, 0.25344854290555285, 0.4484851169383416, 0.12325915465523958], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 803.3518518518514, 553, 1188, 771.5, 1087.0, 1125.75, 1188.0, 0.2528894966562389, 227.55041362360208, 0.12693867312627616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 109.26666666666668, 82, 247, 86.0, 245.8, 247.0, 247.0, 0.09090247981964948, 0.06791054400589049, 0.032312990873391026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, 2.9411764705882355, 165.62352941176474, 81, 706, 87.0, 363.4000000000001, 488.74999999999983, 667.6599999999996, 0.7554481140460024, 1.6126699480518325, 0.36437960073456216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 91.42857142857143, 84, 114, 89.0, 114.0, 114.0, 114.0, 0.0358083740440443, 0.027730508414967898, 0.01272875796096887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c71ff52c-64b8-49c8-81d8-a733f37891ba", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 94.68421052631578, 83, 244, 86.0, 93.0, 244.0, 244.0, 0.10029878480103889, 0.08139481461881183, 0.03565308365974429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a120fcb1-5f9e-4922-a250-d8ccefd91c88", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7708f79d-3548-4dfc-8565-fd60e9a1322b", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 218.0, 165, 493, 176.0, 493.0, 493.0, 493.0, 0.035571636193631656, 0.055129088514935004, 0.0800014435097009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c8f69fa-4f4f-40c9-840e-24948e49ce64", 3, 0, 0.0, 510.33333333333337, 188, 934, 409.0, 934.0, 934.0, 934.0, 0.043184108248164675, 0.027763220634806393, 0.027692934000287894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02e7e1c8-62f9-498f-963f-e206e51e4c19", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 0.6187125428082192, 2.361140839041096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c6303ef-d88d-49cf-8be5-192b847a08ad", 3, 0, 0.0, 382.3333333333333, 245, 528, 374.0, 528.0, 528.0, 528.0, 0.023333229630090532, 0.02757908749572224, 0.014963041136483838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 411.0526315789474, 163, 1228, 214.0, 1202.0, 1228.0, 1228.0, 0.09107293504103076, 23.04930255058143, 0.19991950979992715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 97.56250000000001, 81, 268, 85.0, 147.60000000000014, 268.0, 268.0, 0.07578520578051658, 0.06283363252701032, 0.026939272367293002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82f46e6d-7662-45c4-b1b6-b4276b9cba72", 1, 0, 0.0, 980.0, 980, 980, 980.0, 980.0, 980.0, 980.0, 1.0204081632653061, 0.18435108418367346, 0.7035235969387755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 90.3529411764706, 82, 177, 85.0, 108.19999999999993, 177.0, 177.0, 0.09496463963712336, 0.07372743018702448, 0.03375696174600869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d63430d-ae93-4e0c-8893-2cf987182642", 3, 0, 0.0, 367.3333333333333, 236, 550, 316.0, 550.0, 550.0, 550.0, 0.017520908283885434, 0.024153986517661076, 0.011235738710694764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0390ff9b-214e-49d5-9d74-71551082105d", 3, 0, 0.0, 612.0, 234, 934, 668.0, 934.0, 934.0, 934.0, 0.029016626526999968, 0.029101636175028294, 0.01860766740175454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b35d992e-ec18-426a-8dd0-9286a5065c73", 3, 0, 0.0, 482.6666666666667, 261, 609, 578.0, 609.0, 609.0, 609.0, 0.02070407663268898, 0.02447151766057737, 0.013277028309374116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6325dc1a-fe68-4131-9d2a-acd9d667e600", 3, 0, 0.0, 458.3333333333333, 267, 563, 545.0, 563.0, 563.0, 563.0, 0.06418210602883916, 0.029040731569038553, 0.04115844690000428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 94.20000000000002, 80, 247, 82.0, 155.20000000000005, 247.0, 247.0, 0.08779477094344261, 0.06524591864058576, 0.04406885963372021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 135.2, 79, 247, 83.0, 244.6, 247.0, 247.0, 0.08779528480790391, 0.023492097692739914, 0.0500707483670077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 146.26666666666668, 81, 250, 83.0, 247.6, 250.0, 250.0, 0.08771570754413563, 0.023642124299005304, 0.0515672421304391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 158.66666666666666, 80, 252, 84.0, 250.8, 252.0, 252.0, 0.0877090398783768, 0.023640327154718744, 0.051648975631505084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4676048a-850c-4f8d-a984-8bea358ddbe1", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.47095761381475665], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.526315789473685, 0.15698587127158556], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.526315789473685, 0.15698587127158556], "isController": false}, {"data": ["401/Unauthorized", 9, 47.36842105263158, 0.706436420722135], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1274, 19, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

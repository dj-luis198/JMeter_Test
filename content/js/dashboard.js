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

    var data = {"OkPercent": 97.70370370370371, "KoPercent": 2.2962962962962963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7251908396946565, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/124674ab-95d4-47a8-8355-328561b9b2aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5adae1a4-e7c6-4d4a-b2db-daa1de9767fd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce6e67b4-cbe9-43b8-b51c-df0b77c52fc7"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf5ec902-4866-4744-ac0f-8a48ae833823"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a243925-83f4-4152-908e-c0d2b95fe84a"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99377abe-0156-443d-989b-c0f0995c2e35"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8da03f0d-177e-4c68-80df-bfa4961e927b"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b8dce70e-8b05-4fb0-9579-cad1c2951333"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88ee709b-b6f6-43a9-a4dd-fa531541226f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45c8a245-4a0b-4fa6-be46-09b2c8fb9421"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab0c76e4-87e1-4578-a624-b16540cbd609"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95dab228-a902-40fb-8832-76e5311a4c10"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5adae1a4-e7c6-4d4a-b2db-daa1de9767fd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc5ac987-3def-4f90-b132-bc0446ef7a51"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31d3ec96-8ee2-48e6-91f0-614209978631"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=124674ab-95d4-47a8-8355-328561b9b2aa"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2543859649122807, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95dab228-a902-40fb-8832-76e5311a4c10"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce6e67b4-cbe9-43b8-b51c-df0b77c52fc7"], "isController": false}, {"data": [0.21311475409836064, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf5ec902-4866-4744-ac0f-8a48ae833823"], "isController": false}, {"data": [0.88268156424581, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8da03f0d-177e-4c68-80df-bfa4961e927b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99377abe-0156-443d-989b-c0f0995c2e35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/225ed8be-ec99-434f-a7f5-5ae4e4d3fc31"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88ee709b-b6f6-43a9-a4dd-fa531541226f"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/70194fac-2291-47e5-b5f7-a240a83cd84f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45c8a245-4a0b-4fa6-be46-09b2c8fb9421"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab0c76e4-87e1-4578-a624-b16540cbd609"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc5ac987-3def-4f90-b132-bc0446ef7a51"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31d3ec96-8ee2-48e6-91f0-614209978631"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8dce70e-8b05-4fb0-9579-cad1c2951333"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1350, 31, 2.2962962962962963, 487.36814814814863, 137, 2966, 161.5, 1330.0, 1631.2500000000002, 2129.84, 5.265929436545551, 740.7411864248727, 3.8502118866167376], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2374.0701754385964, 1742, 3241, 2345.0, 2769.4, 2944.7, 3241.0, 0.2498969723008935, 300.7111034814594, 1.2287414604833973], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/124674ab-95d4-47a8-8355-328561b9b2aa", 3, 0, 0.0, 370.6666666666667, 276, 490, 346.0, 490.0, 490.0, 490.0, 0.021397392371116375, 0.025290993391771988, 0.013721635081738038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5adae1a4-e7c6-4d4a-b2db-daa1de9767fd", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce6e67b4-cbe9-43b8-b51c-df0b77c52fc7", 1, 0, 0.0, 1247.0, 1247, 1247, 1247.0, 1247.0, 1247.0, 1247.0, 0.8019246190858059, 0.14487895950280671, 0.5528894346431436], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 684.0000000000001, 156, 1383, 571.0, 1223.5, 1383.0, 1383.0, 0.0993133193348845, 0.018752870775637025, 0.06716257191348392], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 684.0000000000001, 156, 1383, 571.0, 1223.5, 1383.0, 1383.0, 0.0997520449169208, 0.01883571328055975, 0.06745926865719497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 171.86363636363632, 139, 449, 145.0, 344.5999999999998, 445.84999999999997, 449.0, 0.11757601021842416, 0.03146076835922678, 0.06705506832769503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 158.99999999999997, 138, 434, 145.5, 151.4, 391.69999999999936, 434.0, 0.11757412514162338, 0.08737686448513221, 0.059016699533978915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 197.18181818181824, 138, 443, 145.5, 432.7, 441.5, 443.0, 0.11757663859079054, 0.03169057837017401, 0.06923702448266279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 204.40909090909093, 138, 569, 146.0, 442.5, 550.2499999999998, 569.0, 0.11739155954686858, 0.03164069378411692, 0.06901339731173328], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 295.3333333333333, 148, 602, 264.0, 483.80000000000007, 602.0, 602.0, 0.0876716171906507, 0.15302007716563507, 0.05666691506958205], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 164.74999999999997, 139, 420, 149.0, 237.30000000000018, 420.0, 420.0, 0.08272111094451998, 0.061475356864042686, 0.04152212014207351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 198.5, 137, 446, 146.0, 437.6, 446.0, 446.0, 0.08271982794275788, 0.0376641794710067, 0.046307755242369096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1024.2857142857142, 845, 1213, 1035.0, 1213.0, 1213.0, 1213.0, 0.05639430900858805, 16.581799315816188, 0.03216237935646037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1419.5714285714284, 1141, 1692, 1319.0, 1692.0, 1692.0, 1692.0, 0.05626557350695281, 50.627861945884575, 0.03203401304155615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 276.7142857142857, 139, 459, 150.0, 459.0, 459.0, 459.0, 0.05666272725800968, 0.10026646659327494, 0.03137477183133935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf5ec902-4866-4744-ac0f-8a48ae833823", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 0.2622119920174166, 1.000657656023222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 169.7142857142857, 143, 446, 149.0, 300.0, 446.0, 446.0, 0.09108831011665809, 0.06769355859255548, 0.04572206191402565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 188.92857142857144, 143, 444, 148.0, 442.5, 444.0, 444.0, 0.09091263295972571, 0.03407955423587932, 0.05130323665207735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 232.07142857142858, 144, 1027, 148.0, 740.5, 1027.0, 1027.0, 0.09108593958399751, 5.877031795905688, 0.05298944866981998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 303.42857142857144, 142, 1142, 149.5, 801.0, 1142.0, 1142.0, 0.09092030834973147, 1.9322975521330554, 0.05298188169319592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 231.57142857142858, 145, 452, 149.0, 452.0, 452.0, 452.0, 0.05679974034404414, 0.04221152578302499, 0.0318943854470951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a243925-83f4-4152-908e-c0d2b95fe84a", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1066.9999999999998, 139, 2113, 1229.5, 1979.3000000000002, 2113.0, 2113.0, 0.07230854054249483, 40.671903457365076, 0.038625753590570966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 382.31249999999994, 137, 1613, 145.5, 1592.0, 1613.0, 1613.0, 0.08272239398608196, 9.323728676364144, 0.0477431004353266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 794.5624999999999, 138, 1286, 1126.0, 1281.1, 1286.0, 1286.0, 0.07230886732678637, 13.295563483796036, 0.03869654228035052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 295.125, 142, 855, 149.0, 830.5, 855.0, 855.0, 0.08271768969492682, 3.0597265340254047, 0.04782116435487957], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 610.8571428571429, 152, 1568, 479.0, 1407.5, 1568.0, 1568.0, 0.0997691057837576, 0.01883893480445255, 0.06827808990265385], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99377abe-0156-443d-989b-c0f0995c2e35", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 0.679188204887218, 2.5919290413533833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8da03f0d-177e-4c68-80df-bfa4961e927b", 1, 0, 0.0, 1217.0, 1217, 1217, 1217.0, 1217.0, 1217.0, 1217.0, 0.8216926869350862, 0.14845033894823334, 0.5665185907970419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 476.0, 290, 1293, 301.5, 1097.0, 1293.0, 1293.0, 0.09082769985337814, 7.892246669786165, 0.20261368870752183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8dce70e-8b05-4fb0-9579-cad1c2951333", 3, 0, 0.0, 1195.6666666666667, 240, 2899, 448.0, 2899.0, 2899.0, 2899.0, 0.04373942963783752, 0.036463762793783175, 0.02804904830291013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88ee709b-b6f6-43a9-a4dd-fa531541226f", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45c8a245-4a0b-4fa6-be46-09b2c8fb9421", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 601.5217391304348, 227, 1207, 596.0, 1005.0000000000002, 1179.7999999999997, 1207.0, 0.09790358625093114, 0.06013804272640204, 0.044266953549005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 147.74999999999997, 138, 155, 148.5, 152.9, 155.0, 155.0, 0.07230461936136945, 0.053734194662111476, 0.0362935296403749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 231.56249999999997, 145, 596, 149.5, 491.7000000000001, 596.0, 596.0, 0.07230723343486474, 0.08722413095743815, 0.03744229543831741], "isController": false}, {"data": ["login", 23, 0, 0.0, 3054.434782608696, 1848, 4934, 2787.0, 4711.0, 4912.2, 4934.0, 0.0958700835320206, 35.03666070040391, 0.19303053800831987], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 168.75000000000003, 142, 440, 150.0, 244.0000000000002, 440.0, 440.0, 0.08349902671446986, 0.06759833315067922, 0.029681294652409207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab0c76e4-87e1-4578-a624-b16540cbd609", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95dab228-a902-40fb-8832-76e5311a4c10", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5adae1a4-e7c6-4d4a-b2db-daa1de9767fd", 3, 0, 0.0, 487.6666666666667, 240, 621, 602.0, 621.0, 621.0, 621.0, 0.07886020713947742, 0.03568219007938594, 0.05057116147941748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc5ac987-3def-4f90-b132-bc0446ef7a51", 3, 0, 0.0, 485.3333333333333, 317, 741, 398.0, 741.0, 741.0, 741.0, 0.03554291807357384, 0.029630668354955276, 0.022792821811504056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31d3ec96-8ee2-48e6-91f0-614209978631", 1, 0, 0.0, 1568.0, 1568, 1568, 1568.0, 1568.0, 1568.0, 1568.0, 0.6377551020408163, 0.11521942761479591, 0.4397022480867347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1216.8125, 295, 2263, 1377.0, 2128.6000000000004, 2263.0, 2263.0, 0.07225596676225528, 54.069028792309254, 0.150950758687651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 419.6363636363636, 288, 862, 298.5, 679.1999999999999, 839.7999999999997, 862.0, 0.11729579867775645, 0.18178557861484324, 0.2638010003465558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, 30.0, 1200.7, 148, 1841, 1570.0, 1834.0, 1841.0, 1841.0, 0.06544331300227743, 54.8103212489529, 0.11619383532171933], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1257.8333333333333, 376, 2316, 1231.0, 1940.0, 2243.5, 2316.0, 0.10266413428468765, 0.032232928879420975, 0.04631916996047431], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 153.0, 144, 168, 152.5, 165.2, 168.0, 168.0, 0.08059073005127584, 0.06256799842848076, 0.028647486072914466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 593.1250000000001, 288, 2004, 304.5, 1838.8000000000002, 2004.0, 2004.0, 0.08265786360419282, 12.473033275601983, 0.18325587387443237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 469.6666666666667, 290, 599, 575.0, 598.4, 599.0, 599.0, 0.0705308149130355, 0.10930898756541733, 0.15862545580539136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 175.20000000000005, 141, 424, 149.0, 396.80000000000007, 424.0, 424.0, 0.05364375184400397, 0.03986610854813186, 0.026926648874822306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 176.60000000000002, 143, 447, 147.5, 417.2000000000001, 447.0, 447.0, 0.05364576627612549, 0.01435443355435389, 0.03059485107935282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 259.8, 142, 447, 150.0, 445.3, 447.0, 447.0, 0.053567602314120416, 0.014438142811227768, 0.0314918912041997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 230.2, 137, 443, 148.5, 441.6, 443.0, 443.0, 0.05355956895258907, 0.014435977569252523, 0.03153947273282345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=124674ab-95d4-47a8-8355-328561b9b2aa", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 1.9402754934210527, 4.0668688322368425], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1637.9473684210532, 1139, 2629, 1485.0, 2157.4, 2321.8999999999996, 2629.0, 0.2551728460278094, 305.27543628401185, 0.503866694011944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1257.8333333333333, 376, 2316, 1231.0, 1940.0, 2243.5, 2316.0, 0.09922275508516619, 0.031152456796758723, 0.04476651645444022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 179.44444444444446, 143, 427, 148.0, 427.0, 427.0, 427.0, 0.051826898160145116, 0.013968968644726612, 0.030519159756413578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 181.0, 139, 446, 148.0, 446.0, 446.0, 446.0, 0.05182659971437785, 0.013968888204265905, 0.030468372097710417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 384.3125, 139, 1764, 148.0, 1567.3000000000002, 1764.0, 1764.0, 0.08259727119265298, 9.309625953740365, 0.047670886010603424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95dab228-a902-40fb-8832-76e5311a4c10", 3, 0, 0.0, 353.6666666666667, 264, 481, 316.0, 481.0, 481.0, 481.0, 0.03444751920449196, 0.028381077834169644, 0.022090368760693084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 251.62500000000003, 144, 852, 146.0, 847.1, 852.0, 852.0, 0.08259641841280659, 3.0552407104840666, 0.047751054394903805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 167.00000000000003, 143, 440, 149.0, 248.2000000000002, 440.0, 440.0, 0.08259684480052862, 0.061383006731642854, 0.041459744362765345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 178.22222222222226, 143, 427, 149.0, 427.0, 427.0, 427.0, 0.051828091977587226, 0.013868063673690333, 0.029558208705967714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 220.625, 143, 448, 149.5, 445.9, 448.0, 448.0, 0.08259386017891895, 0.037606823543379846, 0.04623723666754423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 183.22222222222223, 144, 434, 150.0, 434.0, 434.0, 434.0, 0.051741682524534184, 0.038452558985518075, 0.02597189923594782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 188.77777777777777, 145, 448, 157.0, 448.0, 448.0, 448.0, 0.0518767868671032, 0.04083270528797381, 0.01844057658166559], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 635.5000000000001, 150, 1408, 533.5, 1207.5, 1408.0, 1408.0, 0.10210258392467747, 0.01908013548648235, 0.06949043745487431], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1618.2173913043478, 961, 2966, 1472.0, 2311.0, 2843.3999999999983, 2966.0, 0.0968115332000421, 0.05010753183205304, 0.044529523571503735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 398.77777777777777, 295, 862, 302.0, 862.0, 862.0, 862.0, 0.05169710094146165, 0.08012040936923792, 0.11626799166815056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce6e67b4-cbe9-43b8-b51c-df0b77c52fc7", 3, 0, 0.0, 403.6666666666667, 288, 556, 367.0, 556.0, 556.0, 556.0, 0.01912021516615467, 0.026358760165581065, 0.012261335897566636], "isController": false}, {"data": ["addBook", 61, 19, 31.147540983606557, 1383.5901639344263, 747, 3314, 1148.0, 2566.4, 2650.1, 3314.0, 0.2776867329473032, 82.81176826273945, 1.0083081608602826], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 273.8245614035087, 145, 652, 151.0, 582.8000000000001, 600.6999999999999, 652.0, 0.2564252520390306, 0.1905660320329124, 0.12395556617121109], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 937.6315789473684, 679, 1472, 879.0, 1180.6, 1210.4999999999986, 1472.0, 0.2561728672485236, 75.3233287107988, 0.12883694007127897], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 233.73684210526315, 139, 582, 151.0, 447.6, 453.39999999999986, 582.0, 0.2569790088725384, 0.454732386793984, 0.12497611954933997], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1359.5789473684217, 987, 1999, 1327.0, 1700.8, 1726.6, 1999.0, 0.25589455348645107, 230.25436904175348, 0.12844707079300377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 152.33333333333334, 145, 163, 151.0, 163.0, 163.0, 163.0, 0.07006431904488321, 0.052342972723960594, 0.024905675910485828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf5ec902-4866-4744-ac0f-8a48ae833823", 3, 0, 0.0, 719.6666666666667, 346, 1408, 405.0, 1408.0, 1408.0, 1408.0, 0.02363265402582261, 0.02370189031691389, 0.01515505482775734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 19, 10.614525139664805, 209.2402234636872, 139, 1149, 153.0, 371.0, 437.0, 825.7999999999954, 0.7496408843249672, 1.6411358957056885, 0.3589929815395697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 153.5, 144, 176, 151.5, 174.20000000000002, 176.0, 176.0, 0.053293540822852266, 0.04127126745363462, 0.01894418833937327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8da03f0d-177e-4c68-80df-bfa4961e927b", 3, 0, 0.0, 488.0, 226, 1007, 231.0, 1007.0, 1007.0, 1007.0, 0.030813475760065732, 0.03090374961483155, 0.019759943765406737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99377abe-0156-443d-989b-c0f0995c2e35", 3, 0, 0.0, 340.3333333333333, 238, 486, 297.0, 486.0, 486.0, 486.0, 0.08734895909157082, 0.03952312927645946, 0.05601479472994614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 168.90909090909093, 144, 448, 154.0, 173.29999999999998, 407.1999999999994, 448.0, 0.11475546653313302, 0.09312675067288433, 0.04079198224419964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/225ed8be-ec99-434f-a7f5-5ae4e4d3fc31", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.9283021438953489, 1.7345339752906979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 465.9, 289, 872, 433.0, 843.9000000000001, 872.0, 872.0, 0.05351628768215606, 0.08293979350740398, 0.12035938528516153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88ee709b-b6f6-43a9-a4dd-fa531541226f", 3, 0, 0.0, 377.0, 276, 473, 382.0, 473.0, 473.0, 473.0, 0.1021276595744681, 0.046210106382978726, 0.06549202127659574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 591.0, 289, 1911, 301.5, 1728.3000000000002, 1911.0, 1911.0, 0.0825320843477902, 12.454053244155697, 0.18297701610407296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70194fac-2291-47e5-b5f7-a240a83cd84f", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.6082589285714285, 1.1365327380952381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45c8a245-4a0b-4fa6-be46-09b2c8fb9421", 3, 0, 0.0, 366.3333333333333, 252, 511, 336.0, 511.0, 511.0, 511.0, 0.08220078912757563, 0.038103490793511614, 0.05271339667360806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab0c76e4-87e1-4578-a624-b16540cbd609", 3, 0, 0.0, 373.6666666666667, 250, 617, 254.0, 617.0, 617.0, 617.0, 0.028092518026032402, 0.02817482032493679, 0.018015058760183538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc5ac987-3def-4f90-b132-bc0446ef7a51", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31d3ec96-8ee2-48e6-91f0-614209978631", 3, 0, 0.0, 501.0, 260, 908, 335.0, 908.0, 908.0, 908.0, 0.02971591584452633, 0.024772936353460912, 0.019056104887277624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8dce70e-8b05-4fb0-9579-cad1c2951333", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 177.85714285714286, 151, 448, 155.5, 309.0, 448.0, 448.0, 0.08939803196618201, 0.07412004798758644, 0.03177820667547876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 151.6875, 142, 162, 151.5, 161.3, 162.0, 162.0, 0.07394706314617024, 0.05741007343867709, 0.0262858701027402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 147.13333333333333, 143, 154, 147.0, 152.8, 154.0, 154.0, 0.07067837100490508, 0.05252562532688746, 0.03547722919582149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 240.20000000000002, 140, 434, 148.0, 432.2, 434.0, 434.0, 0.07058491365112231, 0.01888697884805421, 0.04025545856665569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 281.2666666666667, 143, 452, 151.0, 447.2, 452.0, 452.0, 0.07058092809215046, 0.01902376577483743, 0.041493865929174395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 222.4, 139, 445, 148.0, 444.4, 445.0, 445.0, 0.07067903706879898, 0.019050209209949723, 0.0416205657739119], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 22.580645161290324, 0.5185185185185185], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.14814814814814814], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.225806451612903, 0.07407407407407407], "isController": false}, {"data": ["401/Unauthorized", 21, 67.74193548387096, 1.5555555555555556], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1350, 31, "401/Unauthorized", 21, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.48658410732714136, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/ace7d1da-0517-4998-a28f-3fc267c6899f"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/f486b0cc-1648-4e96-abe9-1c8a3d0524d3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b2856ec-0de1-4ef5-a7c0-658634ce6bf9"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.24468085106382978, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.0, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/032cc9da-764a-4180-ab76-58bb194879bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/0dbfff94-eeef-428a-9b4b-3aebd10924ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.0, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c2a047d-0f66-47c8-a488-8542745c9d5c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=032cc9da-764a-4180-ab76-58bb194879bc"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf335c54-4ada-46b9-8798-3f8871b95411"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abe093ce-9869-46ea-88fe-9fbe8150aead"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8829787234042553, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf335c54-4ada-46b9-8798-3f8871b95411"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9787234042553191, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.3829787234042553, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.0, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.010101010101010102, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/abe093ce-9869-46ea-88fe-9fbe8150aead"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7b04ba3-f0be-4bc8-80b7-77f3a18b7928"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/aff99665-14c8-40d5-b922-557a3fb6ae7b"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b64f792-d848-4598-8c66-f1d50accbeae"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e743bc0a-11fa-4bf4-b02a-23afdfb0de16"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/db8593c1-1b76-4938-b937-46c5090d26f9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f486b0cc-1648-4e96-abe9-1c8a3d0524d3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7b04ba3-f0be-4bc8-80b7-77f3a18b7928"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 847, 0, 0.0, 2079.504132231405, 125, 18086, 661.0, 6058.600000000001, 9497.399999999998, 14317.679999999997, 3.3587120310889045, 552.5449796524308, 2.4554285071674995], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/ace7d1da-0517-4998-a28f-3fc267c6899f", 1, 0, 0.0, 10157.0, 10157, 10157, 10157.0, 10157.0, 10157.0, 10157.0, 0.09845426799251748, 0.03143998597026681, 0.05874566185881658], "isController": false}, {"data": ["see books", 47, 0, 0.0, 10142.340425531915, 5848, 16198, 9647.0, 13682.800000000001, 14754.199999999993, 16198.0, 0.20278549609098598, 244.01923094814086, 0.9970947000176899], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 5, 0, 0.0, 3199.6, 1861, 4661, 3126.0, 4661.0, 4661.0, 4661.0, 0.02793670659753263, 0.021689142329139103, 0.009930626173341678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 498.0769230769231, 255, 1903, 265.0, 1520.5999999999997, 1903.0, 1903.0, 0.08864522815917955, 8.28454649442217, 0.1976205255468729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f486b0cc-1648-4e96-abe9-1c8a3d0524d3", 3, 0, 0.0, 6875.333333333333, 4216, 9059, 7351.0, 9059.0, 9059.0, 9059.0, 0.03377579626439693, 0.015282668231611894, 0.021659608932572252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b2856ec-0de1-4ef5-a7c0-658634ce6bf9", 1, 0, 0.0, 5300.0, 5300, 5300, 5300.0, 5300.0, 5300.0, 5300.0, 0.18867924528301885, 0.06025206367924529, 0.11258107311320754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 8, 0, 0.0, 420.875, 257, 786, 266.0, 786.0, 786.0, 786.0, 0.03863968972329152, 0.05988397225670278, 0.08690156780541053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 158.0, 127, 387, 130.0, 387.0, 387.0, 387.0, 0.050910736508654825, 0.037835029768638985, 0.02555480328657088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 156.8888888888889, 126, 380, 129.0, 380.0, 380.0, 380.0, 0.050910736508654825, 0.013622599417354905, 0.029035029415092204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 155.66666666666666, 126, 377, 128.0, 377.0, 377.0, 377.0, 0.050911024499516344, 0.013722112072135265, 0.029930114012410976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 156.0, 127, 378, 128.0, 378.0, 378.0, 378.0, 0.050911024499516344, 0.013722112072135265, 0.029979831809773785], "isController": false}, {"data": ["https://demoqa.com/books", 47, 0, 0.0, 1585.6595744680853, 1016, 2476, 1502.0, 2258.6000000000004, 2390.7999999999997, 2476.0, 0.20866445867111819, 249.63523607386722, 0.41203079632129], "isController": false}, {"data": ["deleteBook", 5, 0, 0.0, 9394.8, 5751, 15446, 8914.0, 15446.0, 15446.0, 15446.0, 0.05670284308055206, 0.01024416598623255, 0.03854021365631272], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 5, 0, 0.0, 9394.8, 5751, 15446, 8914.0, 15446.0, 15446.0, 15446.0, 0.056104129263913824, 0.010135999915843805, 0.038133275359066424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 15, 0, 0.0, 9687.666666666668, 4246, 12906, 10253.0, 12732.6, 12906.0, 12906.0, 0.06415191172696946, 0.02079925263022838, 0.028943538298691302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 236.58333333333331, 126, 384, 148.0, 383.4, 384.0, 384.0, 0.0679174802614823, 0.018173232023091943, 0.03873418796162662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 180.8, 128, 383, 130.0, 383.0, 383.0, 383.0, 0.09809114629313559, 0.0264386292743217, 0.057762657436289805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 151.16666666666666, 126, 379, 128.0, 308.2000000000003, 379.0, 379.0, 0.06792286226941603, 0.050477830260767194, 0.03409409297507797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 179.8, 126, 382, 130.0, 382.0, 382.0, 382.0, 0.09809884439561302, 0.026440704153505072, 0.057671390943514686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 251.5, 127, 511, 143.5, 482.80000000000007, 511.0, 511.0, 0.0677759327662747, 0.018267731878409976, 0.03991102290826527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 258.25, 125, 392, 265.5, 391.1, 392.0, 392.0, 0.06782534972445951, 0.01828105129292073, 0.03987388724035608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/032cc9da-764a-4180-ab76-58bb194879bc", 3, 0, 0.0, 7451.333333333334, 4596, 12851, 4907.0, 12851.0, 12851.0, 12851.0, 0.01654679433437762, 0.013794381604928739, 0.010611062773022106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 5, 0, 0.0, 281.4, 127, 390, 378.0, 390.0, 390.0, 390.0, 0.028754802051942675, 0.007750317740562674, 0.016904678550067862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 5, 0, 0.0, 282.4, 128, 393, 379.0, 393.0, 393.0, 393.0, 0.02875430595731711, 0.007750184027558127, 0.01693246727759982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 5, 0, 0.0, 233.8, 127, 402, 128.0, 402.0, 402.0, 402.0, 0.02879786204672165, 0.021401536149956227, 0.01445517684767083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 130.6, 127, 141, 128.0, 141.0, 141.0, 141.0, 0.09809499519334523, 0.02624807488571933, 0.05594480194620471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0dbfff94-eeef-428a-9b4b-3aebd10924ae", 1, 0, 0.0, 6183.0, 6183, 6183, 6183.0, 6183.0, 6183.0, 6183.0, 0.16173378618793466, 0.051647410237748666, 0.09650326500080868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 5, 0, 0.0, 128.2, 126, 132, 127.0, 132.0, 132.0, 132.0, 0.028797364465204145, 0.007705544788540952, 0.01642349692156174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 178.6, 127, 379, 129.0, 379.0, 379.0, 379.0, 0.09809307070548537, 0.07289924492858824, 0.049238123381464334], "isController": false}, {"data": ["deleteAccount", 5, 0, 0.0, 12026.4, 7060, 16044, 12851.0, 16044.0, 16044.0, 16044.0, 0.05326118218519978, 0.00962238154713082, 0.036252972639730714], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 4686.6, 2374, 6023, 5006.0, 6023.0, 6023.0, 6023.0, 0.11085982883242429, 0.08725881058489646, 0.039407204780275824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c2a047d-0f66-47c8-a488-8542745c9d5c", 1, 0, 0.0, 10935.0, 10935, 10935, 10935.0, 10935.0, 10935.0, 10935.0, 0.09144947416552354, 0.02920310356652949, 0.05456604366712391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=032cc9da-764a-4180-ab76-58bb194879bc", 1, 0, 0.0, 5871.0, 5871, 5871, 5871.0, 5871.0, 5871.0, 5871.0, 0.170328734457503, 0.03077228112757622, 0.1174336782490206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 13, 0, 0.0, 10765.384615384613, 7069, 14196, 10713.0, 14073.6, 14196.0, 14196.0, 0.0676505484898316, 0.035014444042588626, 0.031116609705772156], "isController": false}, {"data": ["goToProfile", 6, 0, 0.0, 4802.5, 3707, 6053, 4498.5, 6053.0, 6053.0, 6053.0, 0.03962619291351583, 0.055982316811412344, 0.025617714559323716], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 362.8, 258, 763, 263.0, 763.0, 763.0, 763.0, 0.09784161399526446, 0.15163539200242646, 0.2200480830381778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf335c54-4ada-46b9-8798-3f8871b95411", 1, 0, 0.0, 3941.0, 3941, 3941, 3941.0, 3941.0, 3941.0, 3941.0, 0.2537427048972342, 0.04584218789647298, 0.17494370083735095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abe093ce-9869-46ea-88fe-9fbe8150aead", 1, 0, 0.0, 2936.0, 2936, 2936, 2936.0, 2936.0, 2936.0, 2936.0, 0.3405994550408719, 0.06153408123297003, 0.23482735865122617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 169.69230769230768, 126, 398, 129.0, 392.0, 398.0, 398.0, 0.08872387764294781, 0.06593639734988603, 0.0445352276449953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 190.07692307692307, 126, 409, 130.0, 401.8, 409.0, 409.0, 0.088887673330963, 0.03405402148346689, 0.05011950691272598], "isController": false}, {"data": ["addBook", 26, 0, 0.0, 18671.576923076922, 13842, 27517, 18443.5, 22770.7, 26159.349999999995, 27517.0, 0.14249073810202337, 72.69658669602342, 0.5120386262933775], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 6, 0, 0.0, 217.5, 130, 395, 134.0, 395.0, 395.0, 395.0, 0.04042827014170109, 0.03004483747835403, 0.020293096535971052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 6, 0, 0.0, 131.66666666666666, 128, 134, 132.5, 134.0, 134.0, 134.0, 0.04042935980108755, 0.010818012290525378, 0.023057369261557742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 6, 0, 0.0, 216.33333333333334, 129, 393, 132.0, 393.0, 393.0, 393.0, 0.04036082578249551, 0.010878503824188243, 0.023727751094787402], "isController": false}, {"data": ["https://demoqa.com/books-0", 47, 0, 0.0, 252.1702127659575, 127, 567, 133.0, 530.6, 545.8, 567.0, 0.20948755777622272, 0.15568362448018114, 0.10126595810471703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 6, 0, 0.0, 215.83333333333331, 128, 387, 133.5, 387.0, 387.0, 387.0, 0.04035973981421066, 0.010878211121798967, 0.023766526472626004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf335c54-4ada-46b9-8798-3f8871b95411", 3, 0, 0.0, 9966.333333333334, 5842, 15118, 8939.0, 15118.0, 15118.0, 15118.0, 0.032638851112440845, 0.014768230158298427, 0.020930513245933743], "isController": false}, {"data": ["https://demoqa.com/books-3", 47, 0, 0.0, 826.7446808510637, 629, 1149, 772.0, 1035.0, 1095.7999999999997, 1149.0, 0.20931123244235034, 61.54445212506569, 0.10526883272247112], "isController": false}, {"data": ["https://demoqa.com/books-1", 47, 0, 0.0, 200.4255319148936, 126, 536, 132.0, 402.8000000000001, 498.5999999999998, 536.0, 0.2099132656251396, 0.37144808331323526, 0.10208672488410109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1019.9333333333334, 127, 1846, 1258.0, 1641.4, 1846.0, 1846.0, 0.10949384644582974, 65.69167433883966, 0.058097320868067216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 236.1538461538462, 126, 1519, 129.0, 966.5999999999995, 1519.0, 1519.0, 0.08888706556446706, 6.174479380337498, 0.051668277744730026], "isController": false}, {"data": ["https://demoqa.com/books-2", 47, 0, 0.0, 1331.5531914893618, 882, 2108, 1373.0, 1735.8000000000004, 1929.7999999999995, 2108.0, 0.2092068833515833, 188.24472138622932, 0.10501204886983771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 8, 0, 0.0, 3434.0, 2193, 5375, 3098.5, 5375.0, 5375.0, 5375.0, 0.03910680067263697, 0.02921552979938211, 0.013901245551601422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 707.6, 127, 1048, 1008.0, 1043.8, 1048.0, 1048.0, 0.10949384644582974, 21.473054933062762, 0.05820424845248697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 286.15384615384613, 126, 998, 130.0, 817.9999999999998, 998.0, 998.0, 0.08888828110577023, 2.0325849267697316, 0.051755789276654515], "isController": false}, {"data": ["deleteBooks", 5, 0, 0.0, 4599.8, 2936, 6687, 3941.0, 6687.0, 6687.0, 6687.0, 0.05602994240121921, 0.010122597015845268, 0.03863001888209059], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 99, 0, 0.0, 5720.696969696968, 721, 18086, 4639.0, 11153.0, 14430.0, 18086.0, 0.41497254474577694, 1.1725176638408015, 0.18614737681812465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 4037.0, 1025, 6910, 3864.0, 6910.0, 6910.0, 6910.0, 0.05011163759263693, 0.03880715684664169, 0.017813121175507658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 6, 0, 0.0, 437.1666666666667, 264, 783, 268.0, 783.0, 783.0, 783.0, 0.040322851632067426, 0.06249254447274511, 0.09068703838735474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abe093ce-9869-46ea-88fe-9fbe8150aead", 3, 0, 0.0, 8490.666666666666, 4401, 16044, 5027.0, 16044.0, 16044.0, 16044.0, 0.030945062199575022, 0.014001834784312916, 0.019844326996472265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 3648.4166666666665, 1700, 7315, 3522.0, 6537.100000000003, 7315.0, 7315.0, 0.06551005033355535, 0.05316294123748485, 0.023286775704506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7b04ba3-f0be-4bc8-80b7-77f3a18b7928", 3, 0, 0.0, 6518.0, 6053, 7060, 6441.0, 7060.0, 7060.0, 7060.0, 0.02876345890181114, 0.013014716104660639, 0.018445317069195295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 13, 0, 0.0, 5267.923076923076, 3068, 8318, 4855.0, 8295.2, 8318.0, 8318.0, 0.06964385205502935, 0.042779280217395965, 0.03148935888816269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 200.60000000000002, 127, 387, 132.0, 385.2, 387.0, 387.0, 0.10949064949853282, 0.08136951588709325, 0.05495917367406824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 269.93333333333334, 127, 451, 377.0, 418.0, 451.0, 451.0, 0.10949304719150334, 0.13893356053140626, 0.05631478338625497], "isController": false}, {"data": ["login", 13, 0, 0.0, 22524.384615384617, 17470, 29003, 22354.0, 28681.4, 29003.0, 29003.0, 0.0659640648071566, 0.09572519560882295, 0.09952585949907904], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 344.44444444444446, 259, 768, 262.0, 768.0, 768.0, 768.0, 0.050873612987468134, 0.078844163878039, 0.11441594795912023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 3437.4615384615386, 2362, 6213, 3245.0, 5773.799999999999, 6213.0, 6213.0, 0.09174052955456445, 0.07427040918040421, 0.03261089136509908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aff99665-14c8-40d5-b922-557a3fb6ae7b", 1, 0, 0.0, 6416.0, 6416, 6416, 6416.0, 6416.0, 6416.0, 6416.0, 0.15586034912718205, 0.04977181070760598, 0.09299870441084787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 5, 0, 0.0, 518.2, 257, 795, 512.0, 795.0, 795.0, 795.0, 0.028732824953883816, 0.04453026679864611, 0.06462079674686956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b64f792-d848-4598-8c66-f1d50accbeae", 2, 0, 0.0, 4224.0, 3707, 4741, 4224.0, 4741.0, 4741.0, 4741.0, 0.009980786985053771, 0.016793843725827783, 0.006203877847643287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e743bc0a-11fa-4bf4-b02a-23afdfb0de16", 1, 0, 0.0, 4910.0, 4910, 4910, 4910.0, 4910.0, 4910.0, 4910.0, 0.20366598778004075, 0.06503786914460286, 0.12152335794297352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 6, 0, 0.0, 4276.666666666666, 3448, 6340, 3902.0, 6340.0, 6340.0, 6340.0, 0.03899040835954355, 0.03232700849341062, 0.013859871721556498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1222.1333333333332, 257, 1976, 1388.0, 1923.8, 1976.0, 1976.0, 0.10938764794679386, 87.30028065907881, 0.22735681384774697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 4000.066666666667, 980, 7301, 4014.0, 6771.200000000001, 7301.0, 7301.0, 0.10479690360082161, 0.0813608773072785, 0.03725202432685456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db8593c1-1b76-4938-b937-46c5090d26f9", 1, 0, 0.0, 3077.0, 3077, 3077, 3077.0, 3077.0, 3077.0, 3077.0, 0.32499187520311995, 0.10378158514787131, 0.1939160505362366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f486b0cc-1648-4e96-abe9-1c8a3d0524d3", 1, 0, 0.0, 3564.0, 3564, 3564, 3564.0, 3564.0, 3564.0, 3564.0, 0.28058361391694725, 0.05069137556116723, 0.19344924943883277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7b04ba3-f0be-4bc8-80b7-77f3a18b7928", 1, 0, 0.0, 6687.0, 6687, 6687, 6687.0, 6687.0, 6687.0, 6687.0, 0.14954389113204725, 0.02701720689397338, 0.10310350306564976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 467.4166666666667, 257, 768, 514.0, 734.1000000000001, 768.0, 768.0, 0.06772658776519193, 0.1049629831868746, 0.15231868322581738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 8, 0, 0.0, 196.0, 128, 403, 131.5, 403.0, 403.0, 403.0, 0.03866434036218821, 0.02873394825744651, 0.019407686470864004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 8, 0, 0.0, 192.25, 128, 382, 130.0, 382.0, 382.0, 382.0, 0.03866471409860468, 0.010345831702165707, 0.022050969759360484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 8, 0, 0.0, 159.875, 127, 375, 128.5, 375.0, 375.0, 375.0, 0.03866546159311368, 0.010421550195018923, 0.0227310623818891], "isController": false}, {"data": ["register", 15, 0, 0.0, 9687.666666666668, 4246, 12906, 10253.0, 12732.6, 12906.0, 12906.0, 0.0654927455868805, 0.02123397610824641, 0.02954848482533085], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 8, 0, 0.0, 190.875, 126, 379, 128.5, 379.0, 379.0, 379.0, 0.03866546159311368, 0.010421550195018923, 0.022768821621726124], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 847, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

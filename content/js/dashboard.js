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

    var data = {"OkPercent": 99.76209357652657, "KoPercent": 0.23790642347343377};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7634262406526172, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bf2f4660-3d93-4775-ac1e-2214d98b30e5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0baa3e9c-af8c-4157-bd57-57aecc6158ed"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2daeb8aa-983f-4f37-be62-9445c1d1646e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f7093331-99c7-4b31-9bf5-e47d66ce2224"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9aed848-745d-434c-a090-b46b64d197b4"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d69bac5-3be8-4aa8-9e6a-6cdab38e473f"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dec588be-33cd-4415-9a95-969131d991e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/353cb424-b74a-4f15-b242-ee4bde21a1ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c362da63-803d-4318-bb5e-5388b4b01b21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/647d2197-0d68-455c-be07-7214796e17d0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb4fcc6f-6318-478f-8088-1b6cfca37592"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef83e2bc-1eb4-404e-ab76-ec9d28f4bf30"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7e274d1-c04f-4967-b01e-61564b8734e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9806d0a-3559-4a02-b047-2dd6a50669ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5c8952b-859d-438d-bd1f-50d704fcc489"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/981e9378-a718-4bc1-9c76-6b5f2ba97f80"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d69bac5-3be8-4aa8-9e6a-6cdab38e473f"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6302066d-a15c-4eb9-902c-9e6e438dd3b3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c362da63-803d-4318-bb5e-5388b4b01b21"], "isController": false}, {"data": [0.3389830508474576, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dec588be-33cd-4415-9a95-969131d991e7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=353cb424-b74a-4f15-b242-ee4bde21a1ba"], "isController": false}, {"data": [0.9854651162790697, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2daeb8aa-983f-4f37-be62-9445c1d1646e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7093331-99c7-4b31-9bf5-e47d66ce2224"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/136eb472-5be2-46bc-8ada-32d1b04439ca"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6302066d-a15c-4eb9-902c-9e6e438dd3b3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c9806d0a-3559-4a02-b047-2dd6a50669ea"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5c8952b-859d-438d-bd1f-50d704fcc489"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb4fcc6f-6318-478f-8088-1b6cfca37592"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0baa3e9c-af8c-4157-bd57-57aecc6158ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9aed848-745d-434c-a090-b46b64d197b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a7e274d1-c04f-4967-b01e-61564b8734e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41a86397-44a3-4ab0-bd5c-ff47683c7aa2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=981e9378-a718-4bc1-9c76-6b5f2ba97f80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1261, 3, 0.23790642347343377, 408.9230769230773, 125, 3556, 233.0, 1014.5999999999999, 1151.8999999999999, 1722.5799999999952, 4.947892143014094, 697.9576671483112, 3.595585135576561], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/bf2f4660-3d93-4775-ac1e-2214d98b30e5", 1, 0, 0.0, 1240.0, 1240, 1240, 1240.0, 1240.0, 1240.0, 1240.0, 0.8064516129032258, 0.2575289818548387, 0.48119329637096775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0baa3e9c-af8c-4157-bd57-57aecc6158ed", 3, 0, 0.0, 454.33333333333337, 233, 843, 287.0, 843.0, 843.0, 843.0, 0.01587242800531197, 0.0218814233732084, 0.010178607802885608], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1895.4629629629626, 1513, 2690, 1983.0, 2185.0, 2220.5, 2690.0, 0.23024282090093162, 277.058432276899, 1.1321021515978427], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2daeb8aa-983f-4f37-be62-9445c1d1646e", 3, 0, 0.0, 754.3333333333334, 274, 1236, 753.0, 1236.0, 1236.0, 1236.0, 0.022872652694017274, 0.02293966241870678, 0.014667684182035819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7093331-99c7-4b31-9bf5-e47d66ce2224", 3, 0, 0.0, 375.3333333333333, 232, 508, 386.0, 508.0, 508.0, 508.0, 0.02970149992574625, 0.02978851603880996, 0.01904686030394535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9aed848-745d-434c-a090-b46b64d197b4", 3, 0, 0.0, 350.0, 226, 587, 237.0, 587.0, 587.0, 587.0, 0.0742739719244386, 0.03360703807778961, 0.04763011871456513], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 754.2857142857143, 493, 1748, 681.0, 1363.5, 1748.0, 1748.0, 0.08136223629918056, 0.014699232143894927, 0.055300894984599294], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 754.2857142857143, 493, 1748, 681.0, 1363.5, 1748.0, 1748.0, 0.08258563835748962, 0.014920256929819905, 0.05613242607110624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 236.23076923076923, 126, 494, 135.0, 453.59999999999997, 494.0, 494.0, 0.09741257221643575, 0.048574568387372334, 0.054296971592995284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 150.7692307692308, 127, 393, 128.0, 294.9999999999999, 393.0, 393.0, 0.09740016483104819, 0.07238430218401139, 0.04889031711245973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 294.07692307692304, 126, 1011, 131.0, 959.8, 1011.0, 1011.0, 0.09704461812942766, 4.41203091990833, 0.055863349513657165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 264.7692307692308, 125, 886, 130.0, 884.8, 886.0, 886.0, 0.09704461812942766, 13.456119852902754, 0.05576857937876514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d69bac5-3be8-4aa8-9e6a-6cdab38e473f", 3, 0, 0.0, 372.66666666666663, 228, 653, 237.0, 653.0, 653.0, 653.0, 0.04728206906334221, 0.03039781458336617, 0.030320858090750052], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 371.6428571428572, 224, 1236, 280.0, 866.5, 1236.0, 1236.0, 0.08118624704974978, 0.1889720896905064, 0.05248564018255307], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dec588be-33cd-4415-9a95-969131d991e7", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 159.53846153846152, 126, 379, 129.0, 333.79999999999995, 379.0, 379.0, 0.08687690878592862, 0.06456379647079265, 0.043608135855436825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 207.15384615384616, 125, 392, 129.0, 388.0, 392.0, 392.0, 0.08688039243204951, 0.043322719723854014, 0.04842642066149394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 309.18317889064144, 0.5996976866456362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 1127.0, 1127, 1127, 1127.0, 1127.0, 1127.0, 1127.0, 0.8873114463176576, 798.40439912378, 0.5051782941437445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 126.0, 7.936507936507936, 14.04389880952381, 4.39453125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/353cb424-b74a-4f15-b242-ee4bde21a1ba", 3, 0, 0.0, 349.0, 233, 482, 332.0, 482.0, 482.0, 482.0, 0.024770051356573147, 0.024842619866406856, 0.015884440485823274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 129.25000000000003, 127, 132, 129.0, 131.3, 132.0, 132.0, 0.09062383180216818, 0.067348375001416, 0.045488915572572695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 143.875, 126, 385, 127.5, 207.90000000000018, 385.0, 385.0, 0.09062331851264478, 0.02424881764889128, 0.05168361133924273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c362da63-803d-4318-bb5e-5388b4b01b21", 1, 0, 0.0, 808.0, 808, 808, 808.0, 808.0, 808.0, 808.0, 1.2376237623762376, 0.22359413675742573, 0.8532835705445544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 144.00000000000003, 126, 382, 128.0, 207.00000000000017, 382.0, 382.0, 0.09062331851264478, 0.02442581631786129, 0.05327659935997281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 143.68750000000003, 126, 378, 128.0, 206.50000000000017, 378.0, 378.0, 0.09062383180216818, 0.02442595466542814, 0.05336540095381583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 128.0, 7.8125, 5.80596923828125, 4.38690185546875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 877.9230769230769, 126, 1527, 1121.0, 1375.3999999999999, 1527.0, 1527.0, 0.07265126832348814, 50.2904719084091, 0.03790833156362295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 303.15384615384613, 126, 1126, 131.0, 1028.8, 1126.0, 1126.0, 0.08688097306689835, 12.046837929392503, 0.04992784284568603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 720.1538461538462, 126, 1015, 884.0, 1009.0, 1015.0, 1015.0, 0.07265086230985034, 16.43664635236786, 0.03797906781957997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 257.6923076923077, 126, 895, 129.0, 788.1999999999999, 895.0, 895.0, 0.08687342541916428, 3.9496084013284953, 0.05000834277246513], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 614.6428571428572, 225, 1284, 567.5, 1167.0, 1284.0, 1284.0, 0.08270565647614828, 0.014941939890710382, 0.057021673312656916], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/647d2197-0d68-455c-be07-7214796e17d0", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 290.87499999999994, 256, 515, 259.5, 510.1, 515.0, 515.0, 0.09055715288311335, 0.14034590002490321, 0.20366515926739265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 578.5999999999999, 171, 1781, 534.5, 945.0000000000002, 1739.8499999999995, 1781.0, 0.0875871492134674, 0.05380109067897558, 0.03960239266194864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 129.76923076923077, 128, 139, 129.0, 136.2, 139.0, 139.0, 0.07264883230972992, 0.05399000135518014, 0.0364663084054699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 227.0, 125, 396, 131.0, 391.6, 396.0, 396.0, 0.07265167434166406, 0.10337800596302588, 0.03674061535968167], "isController": false}, {"data": ["login", 20, 0, 0.0, 2504.95, 1386, 5416, 2166.5, 4096.000000000002, 5354.4, 5416.0, 0.08450692322968559, 5.176267742492616, 0.13450960368365678], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 145.9230769230769, 128, 293, 131.0, 239.39999999999995, 293.0, 293.0, 0.0845292048402723, 0.06843233477791577, 0.03004749078306555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb4fcc6f-6318-478f-8088-1b6cfca37592", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef83e2bc-1eb4-404e-ab76-ec9d28f4bf30", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1024.5384615384614, 256, 1659, 1250.0, 1506.1999999999998, 1659.0, 1659.0, 0.07259690290443455, 66.83452918988837, 0.1489839836573203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7e274d1-c04f-4967-b01e-61564b8734e4", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9806d0a-3559-4a02-b047-2dd6a50669ea", 1, 0, 0.0, 899.0, 899, 899, 899.0, 899.0, 899.0, 899.0, 1.1123470522803114, 0.20096113737486096, 0.7669111512791991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5c8952b-859d-438d-bd1f-50d704fcc489", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 506.0769230769231, 257, 1140, 507.0, 1096.3999999999999, 1140.0, 1140.0, 0.09676002768825408, 17.935908867405267, 0.21380680697490936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 1255.0, 1255, 1255, 1255.0, 1255.0, 1255.0, 1255.0, 0.7968127490039841, 953.265064741036, 1.7967193725099604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/981e9378-a718-4bc1-9c76-6b5f2ba97f80", 3, 0, 0.0, 389.33333333333337, 224, 677, 267.0, 677.0, 677.0, 677.0, 0.08425309630128906, 0.03905482068132671, 0.05402949209425113], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1157.2272727272725, 397, 2765, 1066.0, 2153.8999999999996, 2687.599999999999, 2765.0, 0.09282387092418821, 0.029650238599540944, 0.041879519889623976], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 146.8421052631579, 128, 385, 131.0, 145.0, 385.0, 385.0, 0.11031439602868175, 0.08564447738554881, 0.03921332046332046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 533.923076923077, 254, 1506, 506.0, 1313.1999999999998, 1506.0, 1506.0, 0.08679512344937174, 16.08876580046803, 0.19178775212314225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 420.76190476190476, 258, 801, 509.0, 542.8, 775.2999999999996, 801.0, 0.09109285398249282, 0.1411761320998204, 0.20486996359539159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 211.53846153846155, 127, 428, 130.0, 408.4, 428.0, 428.0, 0.06290951675812742, 0.04675209204388181, 0.03157762852898193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 185.6153846153846, 126, 380, 128.0, 380.0, 380.0, 380.0, 0.06283410828733554, 0.024072562519937744, 0.035429147896990726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 283.0769230769231, 125, 876, 142.0, 681.5999999999999, 876.0, 876.0, 0.06290647259213379, 4.369755210652001, 0.03656627741270517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 265.3076923076923, 128, 879, 130.0, 681.7999999999998, 879.0, 879.0, 0.06283380458686774, 1.4368040703013605, 0.036585398088402325], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1181.4074074074076, 998, 2164, 1022.0, 1653.5, 1696.75, 2164.0, 0.22962600727149024, 274.7125356132928, 0.4534216667021028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1157.2272727272725, 397, 2765, 1066.0, 2153.8999999999996, 2687.599999999999, 2765.0, 0.09160864785635764, 0.02926206631633299, 0.04133124541956761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 283.8, 125, 392, 381.0, 392.0, 392.0, 392.0, 0.0365911668923122, 0.00986246295144352, 0.021547337535218997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 280.4, 125, 390, 378.0, 390.0, 390.0, 390.0, 0.0365911668923122, 0.00986246295144352, 0.02151160397380072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 389.0526315789474, 125, 1144, 140.0, 1143.0, 1144.0, 1144.0, 0.11334689518991571, 21.49564211016125, 0.06458489309598095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d69bac5-3be8-4aa8-9e6a-6cdab38e473f", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 351.8947368421053, 126, 882, 380.0, 649.0, 882.0, 882.0, 0.11366627581420947, 7.060325571621719, 0.06487787792541098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 189.68421052631578, 127, 448, 132.0, 392.0, 448.0, 448.0, 0.11402029561261905, 0.0847357860949249, 0.05723284369617792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 129.2, 128, 131, 129.0, 131.0, 131.0, 131.0, 0.036590095792870786, 0.009790709225826753, 0.02086778900687162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 228.9473684210526, 126, 692, 128.0, 457.0, 692.0, 692.0, 0.11384608009970519, 0.06646092607794263, 0.06291493900246867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 308.2, 126, 518, 382.0, 518.0, 518.0, 518.0, 0.03648623009676148, 0.027115254984019028, 0.018314377216538478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 130.8, 130, 131, 131.0, 131.0, 131.0, 131.0, 0.035908189939961505, 0.02826367294102439, 0.012764239392720691], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 691.0, 482, 1253, 655.0, 1088.9999999999998, 1253.0, 1253.0, 0.0765895272658717, 0.0138369751408069, 0.052131738773742754], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6302066d-a15c-4eb9-902c-9e6e438dd3b3", 3, 0, 0.0, 404.6666666666667, 321, 571, 322.0, 571.0, 571.0, 571.0, 0.04463754314962504, 0.028988248236817046, 0.028624986980716582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1380.1999999999998, 903, 3556, 1145.0, 2213.300000000001, 3491.0499999999993, 3556.0, 0.08661158170070501, 0.04482826005993522, 0.03983794431741412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 594.0, 256, 909, 764.0, 909.0, 909.0, 909.0, 0.036451650530736034, 0.05649293885964656, 0.08198061637918465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c362da63-803d-4318-bb5e-5388b4b01b21", 3, 0, 0.0, 717.3333333333334, 238, 1145, 769.0, 1145.0, 1145.0, 1145.0, 0.016135712095867644, 0.02224438174674462, 0.010347445582310957], "isController": false}, {"data": ["addBook", 59, 0, 0.0, 1277.7627118644075, 755, 2167, 1144.0, 1855.0, 2114.0, 2167.0, 0.2702801751782017, 105.1404465549585, 0.9796493200621186], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 230.4074074074074, 127, 859, 131.0, 513.0, 544.5, 859.0, 0.2304885075869134, 0.1712907756578526, 0.11141778442922082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dec588be-33cd-4415-9a95-969131d991e7", 3, 0, 0.0, 496.0, 398, 671, 419.0, 671.0, 671.0, 671.0, 0.021510927551196008, 0.025803309904348076, 0.013794442472609419], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 717.1296296296297, 620, 1027, 639.0, 915.0, 1010.75, 1027.0, 0.23074457857066555, 67.84656754086102, 0.116048298792864], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 172.49999999999997, 125, 418, 129.5, 380.5, 388.25, 418.0, 0.23123862541483783, 0.4091839738785997, 0.11245784712557541], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 947.3518518518517, 867, 1278, 888.0, 1151.5, 1190.0, 1278.0, 0.23049441051054514, 207.39927574334448, 0.11569738965080097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 132.76190476190476, 128, 159, 131.0, 144.4, 157.79999999999998, 159.0, 0.09533537623425263, 0.07122222931562819, 0.033888747020769494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=353cb424-b74a-4f15-b242-ee4bde21a1ba", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 0, 0.0, 205.81395348837208, 127, 1185, 134.0, 376.00000000000017, 400.6999999999999, 759.410000000006, 0.6900120752113161, 1.457378622312664, 0.33414232777780006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 131.6923076923077, 129, 143, 132.0, 139.4, 143.0, 143.0, 0.06225725656215429, 0.04821289497440269, 0.022130509168578283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2daeb8aa-983f-4f37-be62-9445c1d1646e", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7093331-99c7-4b31-9bf5-e47d66ce2224", 1, 0, 0.0, 1050.0, 1050, 1050, 1050.0, 1050.0, 1050.0, 1050.0, 0.9523809523809523, 0.1720610119047619, 0.6566220238095238], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 187.84615384615387, 129, 560, 132.0, 492.79999999999995, 560.0, 560.0, 0.09423021165555233, 0.07647002527906639, 0.033495895549434614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 517.0769230769231, 257, 1006, 513.0, 927.1999999999999, 1006.0, 1006.0, 0.06279374187907857, 5.868535565409343, 0.1399887227873659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/136eb472-5be2-46bc-8ada-32d1b04439ca", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 650.8947368421053, 255, 1536, 516.0, 1522.0, 1536.0, 1536.0, 0.1132597343761177, 28.664475162214764, 0.24862304664214693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6302066d-a15c-4eb9-902c-9e6e438dd3b3", 1, 0, 0.0, 696.0, 696, 696, 696.0, 696.0, 696.0, 696.0, 1.4367816091954022, 0.25957480244252873, 0.9905935704022989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9806d0a-3559-4a02-b047-2dd6a50669ea", 3, 0, 0.0, 671.6666666666667, 265, 1253, 497.0, 1253.0, 1253.0, 1253.0, 0.01871747838131247, 0.025803554995071067, 0.012003070446349469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5c8952b-859d-438d-bd1f-50d704fcc489", 3, 0, 0.0, 417.0, 327, 561, 363.0, 561.0, 561.0, 561.0, 0.09866473722291653, 0.044643224199171216, 0.06327133213839374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb4fcc6f-6318-478f-8088-1b6cfca37592", 2, 0, 0.0, 358.5, 341, 376, 358.5, 376.0, 376.0, 376.0, 0.016032449678148573, 0.027117385588430985, 0.009965482636856999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 134.06250000000003, 126, 153, 132.0, 143.9, 153.0, 153.0, 0.09220679679350864, 0.07644879929461801, 0.03277663479769253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0baa3e9c-af8c-4157-bd57-57aecc6158ed", 1, 0, 0.0, 1284.0, 1284, 1284, 1284.0, 1284.0, 1284.0, 1284.0, 0.778816199376947, 0.1407040985202492, 0.5369572624610591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 133.15384615384613, 129, 141, 132.0, 140.6, 141.0, 141.0, 0.07142229254571027, 0.0554499243885153, 0.02538839305335795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9aed848-745d-434c-a090-b46b64d197b4", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7e274d1-c04f-4967-b01e-61564b8734e4", 3, 0, 0.0, 1188.0, 412, 2497, 655.0, 2497.0, 2497.0, 2497.0, 0.02685284640171858, 0.026931516850161118, 0.017220087047977086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41a86397-44a3-4ab0-bd5c-ff47683c7aa2", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.9795580904907976, 1.8303057898773005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 140.95238095238096, 127, 377, 129.0, 132.0, 352.49999999999966, 377.0, 0.09126070140367651, 0.06782167360175567, 0.0458085942592673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 241.33333333333337, 126, 423, 130.0, 413.6, 422.2, 423.0, 0.09114425096786513, 0.02438820777851079, 0.05198070563011059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 235.9047619047619, 125, 384, 131.0, 382.8, 383.9, 384.0, 0.0911624514885526, 0.02457112950277394, 0.05359355058213737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=981e9378-a718-4bc1-9c76-6b5f2ba97f80", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 0.6666570571955719, 2.5441074723247232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 189.28571428571428, 125, 389, 131.0, 381.8, 388.3, 389.0, 0.09126228781518084, 0.02459803851268546, 0.05374136675054106], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 100.0, 0.23790642347343377], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1261, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

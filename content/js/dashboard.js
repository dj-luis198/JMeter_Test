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

    var data = {"OkPercent": 97.459584295612, "KoPercent": 2.540415704387991};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7498347653668209, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be8ec161-a1cf-4d9f-a4ba-cc8cab581b5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0af48ccb-d372-41d2-bad7-e20e0380cf81"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e20cd225-281a-4ac6-b184-505ea7569bf9"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7eb316e8-509b-475d-8dfe-8fd5d55d7354"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9e4474c-d50d-4975-899c-eeedb915de73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28734a17-016c-40d3-8866-0b9e6289e9bf"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28734a17-016c-40d3-8866-0b9e6289e9bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63c67fa9-e7c8-4e4e-80f3-73e03064bbd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c798883-cf70-4478-b9d9-34cecf1bb73f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.25862068965517243, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5c798883-cf70-4478-b9d9-34cecf1bb73f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63c67fa9-e7c8-4e4e-80f3-73e03064bbd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be8ec161-a1cf-4d9f-a4ba-cc8cab581b5c"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20ef4716-26f9-4170-b937-e7e7a3a5d8ea"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9093567251461988, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9e4474c-d50d-4975-899c-eeedb915de73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4e2e6b2-7550-4922-9a92-f86b3332d532"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/20ef4716-26f9-4170-b937-e7e7a3a5d8ea"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a4e2e6b2-7550-4922-9a92-f86b3332d532"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1606776-9f52-4991-a186-3a66db56ea88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/0d57faf5-c326-47aa-a6f6-e11e117af0bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1606776-9f52-4991-a186-3a66db56ea88"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e20cd225-281a-4ac6-b184-505ea7569bf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7eb316e8-509b-475d-8dfe-8fd5d55d7354"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d81eb70-fe5e-4c94-8c29-161b0a7e3162"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d81eb70-fe5e-4c94-8c29-161b0a7e3162"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 33, 2.540415704387991, 426.6096997690534, 136, 2053, 156.0, 1133.0, 1292.0, 1733.0, 5.075289318840693, 704.4430957238051, 3.7231020837891586], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2110.9818181818177, 1696, 2650, 2188.0, 2502.4, 2533.7999999999997, 2650.0, 0.2512218517334308, 302.3038141115311, 1.2352558823025623], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 151.06666666666666, 145, 161, 151.0, 160.4, 161.0, 161.0, 0.07561589143574414, 0.05870569696427401, 0.02687908640879967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 373.37500000000006, 289, 699, 299.0, 616.4000000000001, 699.0, 699.0, 0.08313847752663028, 0.12884840218238505, 0.18698038451545856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be8ec161-a1cf-4d9f-a4ba-cc8cab581b5c", 3, 0, 0.0, 327.6666666666667, 226, 425, 332.0, 425.0, 425.0, 425.0, 0.03200409652435512, 0.026680498437133285, 0.020523460336256374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0af48ccb-d372-41d2-bad7-e20e0380cf81", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e20cd225-281a-4ac6-b184-505ea7569bf9", 3, 0, 0.0, 572.0, 363, 875, 478.0, 875.0, 875.0, 875.0, 0.018665073913692695, 0.025731311205888206, 0.011969464716788612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 412.29999999999995, 288, 891, 301.0, 594.5, 876.1999999999998, 891.0, 0.1264670174018616, 0.19599917638354916, 0.28442728620750707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7eb316e8-509b-475d-8dfe-8fd5d55d7354", 1, 0, 0.0, 776.0, 776, 776, 776.0, 776.0, 776.0, 776.0, 1.288659793814433, 0.23281451353092783, 0.8884705219072164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9e4474c-d50d-4975-899c-eeedb915de73", 3, 0, 0.0, 453.33333333333337, 239, 784, 337.0, 784.0, 784.0, 784.0, 0.019078993392308622, 0.022550724286286652, 0.012234901361604161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 145.4, 143, 150, 145.0, 150.0, 150.0, 150.0, 0.02534096265248924, 0.01883249275248468, 0.012719975393925265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 144.6, 143, 146, 144.0, 146.0, 146.0, 146.0, 0.0253410910860178, 0.006780721638250857, 0.014452341009994527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 144.0, 138, 149, 144.0, 149.0, 149.0, 149.0, 0.02534044893139327, 0.006830042876039592, 0.014897412360057372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 257.8, 145, 439, 148.0, 439.0, 439.0, 439.0, 0.02530325956589728, 0.00682001917987075, 0.014900259295152402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 150.0, 146, 153, 151.0, 153.0, 153.0, 153.0, 0.14132943892212746, 0.04168114311961182, 0.08736478011494794], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1377.7272727272725, 1102, 2032, 1185.0, 1870.2, 1926.7999999999995, 2032.0, 0.255522776371112, 305.6940746300727, 0.5045576697484262], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 427.14285714285717, 145, 635, 464.0, 610.5, 635.0, 635.0, 0.09989225906343872, 0.020492685121761528, 0.06687123397264379], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 427.14285714285717, 145, 635, 464.0, 610.5, 635.0, 635.0, 0.10146618639338441, 0.02081557297593077, 0.06792487380143067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 994.2608695652175, 222, 2015, 974.0, 1744.0, 1966.3999999999992, 2015.0, 0.09257097779101497, 0.028881264640301378, 0.04176542162055559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 181.59999999999997, 140, 429, 144.0, 421.8, 429.0, 429.0, 0.0880752044812664, 0.032385986647799, 0.049737260655631825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 144.11111111111111, 137, 148, 145.0, 148.0, 148.0, 148.0, 0.07119915193899023, 0.019190396421055963, 0.04192684435469835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 164.9333333333333, 138, 445, 145.0, 269.2000000000001, 445.0, 445.0, 0.088073135932078, 0.06545278949639781, 0.044208585809656344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 195.22222222222223, 143, 583, 146.0, 583.0, 583.0, 583.0, 0.07095497512633928, 0.019124583139521135, 0.041713764673883054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 236.53333333333336, 137, 970, 144.0, 644.2000000000002, 970.0, 970.0, 0.088073135932078, 1.748584316082742, 0.0513587941760171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28734a17-016c-40d3-8866-0b9e6289e9bf", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 276.93333333333334, 136, 994, 147.0, 664.0000000000002, 994.0, 994.0, 0.08792909397861563, 5.2967032176919195, 0.0511889295805196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 298.8, 139, 996, 147.0, 667.2000000000002, 996.0, 996.0, 0.07459494942462429, 4.493476399712063, 0.04342630454134052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 280.8, 139, 1003, 149.0, 668.2000000000002, 1003.0, 1003.0, 0.07458827273450552, 1.480858862205625, 0.04349525773977643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 184.4666666666667, 141, 438, 147.0, 427.2, 438.0, 438.0, 0.0746922678564315, 0.0555086092175238, 0.03749201726387284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28734a17-016c-40d3-8866-0b9e6289e9bf", 3, 0, 0.0, 336.3333333333333, 220, 468, 321.0, 468.0, 468.0, 468.0, 0.023275480832641537, 0.023343670717893415, 0.014926008216244735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 178.66666666666666, 143, 430, 149.0, 430.0, 430.0, 430.0, 0.07104066683505936, 0.019008928430474865, 0.04051538030436979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 202.93333333333334, 138, 438, 145.0, 432.6, 438.0, 438.0, 0.0746941275476922, 0.02746565315034932, 0.042180785309158995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 180.0, 142, 444, 147.0, 444.0, 444.0, 444.0, 0.07119633576191944, 0.052910558119942094, 0.035737223224244725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 219.88888888888889, 147, 449, 154.0, 449.0, 449.0, 449.0, 0.06862371330537552, 0.054014368089973314, 0.024393585589020206], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 515.5714285714286, 143, 894, 502.5, 869.5, 894.0, 894.0, 0.10512088902237574, 0.020949384761225407, 0.07153001342168494], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1264.2380952380952, 892, 2053, 1214.0, 1684.8000000000002, 2020.9999999999995, 2053.0, 0.09128093228258838, 0.047245013779074065, 0.041985663188573365], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 275.06666666666666, 142, 884, 236.0, 571.4000000000002, 884.0, 884.0, 0.09219818922756357, 0.18087892149631513, 0.059586681280079656], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 377.22222222222223, 289, 1027, 298.0, 1027.0, 1027.0, 1027.0, 0.07086948989716049, 0.10983386764335323, 0.15938714378238342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63c67fa9-e7c8-4e4e-80f3-73e03064bbd7", 3, 0, 0.0, 399.3333333333333, 257, 556, 385.0, 556.0, 556.0, 556.0, 0.030217262114604005, 0.03030578924970538, 0.019377606238857384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 145.625, 138, 152, 145.0, 152.0, 152.0, 152.0, 0.08320332813312532, 0.06183372334893395, 0.04176417056682267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c798883-cf70-4478-b9d9-34cecf1bb73f", 1, 0, 0.0, 693.0, 693, 693, 693.0, 693.0, 693.0, 693.0, 1.443001443001443, 0.2606985028860029, 0.9948818542568544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 162.25, 136, 427, 144.5, 238.7000000000002, 427.0, 427.0, 0.08320635696567218, 0.02226420098495525, 0.047453625456984914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 918.375, 676, 1001, 990.0, 1001.0, 1001.0, 1001.0, 0.1314017279327223, 38.636470960218126, 0.0749400479616307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1182.625, 956, 1337, 1257.5, 1337.0, 1337.0, 1337.0, 0.13014266890078247, 117.10260224333426, 0.0740948984073791], "isController": false}, {"data": ["addBook", 58, 13, 22.413793103448278, 1271.6551724137933, 730, 2698, 1135.0, 1995.6, 2147.75, 2698.0, 0.259492736440386, 65.2739446712831, 0.9458429850836416], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5c798883-cf70-4478-b9d9-34cecf1bb73f", 3, 0, 0.0, 619.3333333333334, 447, 884, 527.0, 884.0, 884.0, 884.0, 0.02013058036463191, 0.023793664486972163, 0.012909258892683878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 256.875, 139, 453, 150.5, 453.0, 453.0, 453.0, 0.13205896432757225, 0.23368246422027436, 0.0731224929430991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 147.84615384615384, 144, 158, 146.0, 156.0, 158.0, 158.0, 0.06601263380253082, 0.049058217113013634, 0.03313524782666098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63c67fa9-e7c8-4e4e-80f3-73e03064bbd7", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 233.6923076923077, 139, 434, 146.0, 433.6, 434.0, 434.0, 0.06591991237722417, 0.017638726554061936, 0.03759495002763565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 167.53846153846155, 139, 428, 146.0, 317.9999999999999, 428.0, 428.0, 0.06592091518513635, 0.017767746670993786, 0.0387542880287618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be8ec161-a1cf-4d9f-a4ba-cc8cab581b5c", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 276.2909090909091, 142, 626, 151.0, 586.4, 599.8, 626.0, 0.25669747036311025, 0.19076833490852235, 0.12408715608373005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 232.61538461538458, 143, 444, 145.0, 442.0, 444.0, 444.0, 0.06601632126588836, 0.01779346159119647, 0.03887484543294011], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 829.5454545454545, 682, 1202, 739.0, 1026.8, 1178.8, 1202.0, 0.2565537830021457, 75.43533058995709, 0.12902851391221196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 181.125, 137, 428, 148.0, 428.0, 428.0, 428.0, 0.13269198872118096, 0.09861191739923703, 0.07450966163542876], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 208.81818181818178, 138, 581, 150.0, 437.59999999999997, 445.4, 581.0, 0.257263002306012, 0.4552349220493103, 0.1251142335433535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 730.9500000000002, 138, 1432, 725.0, 1324.5, 1426.6499999999999, 1432.0, 0.11233683075333079, 50.55557803267317, 0.061214796445662675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 162.5, 136, 429, 144.0, 233.70000000000022, 429.0, 429.0, 0.08320332813312532, 0.022425897035881433, 0.04891445657826313], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1092.4363636363637, 956, 1442, 1008.0, 1307.4, 1346.3999999999996, 1442.0, 0.2562573382783234, 230.58080343518787, 0.12862917175298658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 571.1, 144, 1139, 570.5, 1122.6000000000001, 1138.7, 1139.0, 0.11215288681530662, 16.503450628897312, 0.06122408567359024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 166.95, 146, 451, 152.0, 162.3, 436.5999999999998, 451.0, 0.12700347989534913, 0.09488052941400595, 0.04514576824404989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 189.5, 137, 553, 147.5, 475.30000000000007, 553.0, 553.0, 0.08320419349135197, 0.02242613027696596, 0.04899621940945824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20ef4716-26f9-4170-b937-e7e7a3a5d8ea", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 502.14285714285717, 146, 843, 497.5, 814.5, 843.0, 843.0, 0.10167472802010255, 0.020858354848432032, 0.06854675267259286], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, 7.60233918128655, 213.93567251461994, 138, 1222, 152.0, 335.20000000000005, 441.20000000000005, 1142.8000000000002, 0.7182007182007182, 1.5630373052248052, 0.34440854753354755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 148.6, 139, 155, 149.0, 155.0, 155.0, 155.0, 0.02537839182206702, 0.019653383510643697, 0.009021225218000386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9e4474c-d50d-4975-899c-eeedb915de73", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4e2e6b2-7550-4922-9a92-f86b3332d532", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20ef4716-26f9-4170-b937-e7e7a3a5d8ea", 3, 0, 0.0, 652.6666666666666, 236, 943, 779.0, 943.0, 943.0, 943.0, 0.03487358326068003, 0.029072671461784362, 0.022363593432141816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4e2e6b2-7550-4922-9a92-f86b3332d532", 3, 0, 0.0, 1051.6666666666667, 232, 2029, 894.0, 2029.0, 2029.0, 2029.0, 0.02904218861933435, 0.029127273156305058, 0.018624059759143448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 426.23076923076917, 290, 591, 305.0, 589.0, 591.0, 591.0, 0.06586847585413678, 0.10208327263722176, 0.14813974598835647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 154.13333333333335, 146, 175, 152.0, 168.4, 175.0, 175.0, 0.08644387199391436, 0.07015122815131135, 0.03072809512283674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 528.9047619047619, 183, 990, 500.0, 919.4000000000001, 983.8999999999999, 990.0, 0.09126228781518084, 0.05605857327709838, 0.0412641008383093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 175.84999999999997, 139, 441, 146.5, 402.50000000000057, 440.45, 441.0, 0.11232610514846704, 0.08347672462693692, 0.056382439498351616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 262.3499999999999, 139, 445, 149.5, 444.9, 445.0, 445.0, 0.11214471153576575, 0.11422552161308952, 0.05924832904379811], "isController": false}, {"data": ["login", 21, 0, 0.0, 2668.809523809524, 1330, 3705, 2621.0, 3593.0, 3694.7, 3705.0, 0.08981613354375971, 41.05324887141751, 0.1922501307145515], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 404.2, 291, 585, 299.0, 585.0, 585.0, 585.0, 0.025284577924540707, 0.03918615738891221, 0.05686560835958716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1606776-9f52-4991-a186-3a66db56ea88", 1, 0, 0.0, 843.0, 843, 843, 843.0, 843.0, 843.0, 843.0, 1.1862396204033216, 0.21431086892052195, 0.8178566132858838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 153.12499999999997, 146, 179, 151.5, 168.5, 179.0, 179.0, 0.08000960115213826, 0.06477339780773693, 0.028440912909549147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 525.4, 288, 1150, 567.0, 981.4000000000001, 1150.0, 1150.0, 0.07453305043899967, 6.05230690660512, 0.16635524532553553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d57faf5-c326-47aa-a6f6-e11e117af0bf", 2, 0, 0.0, 374.5, 229, 520, 374.5, 520.0, 520.0, 520.0, 0.017693791248650847, 0.025192917617707946, 0.010998142704849868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 175.6153846153846, 146, 449, 149.0, 340.5999999999999, 449.0, 449.0, 0.06457220911461567, 0.0535369194710046, 0.02295340245871104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1606776-9f52-4991-a186-3a66db56ea88", 3, 0, 0.0, 496.66666666666663, 226, 845, 419.0, 845.0, 845.0, 845.0, 0.03736222678871661, 0.03092843187620649, 0.02395950090292048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 940.0500000000002, 289, 1583, 1023.5, 1471.5, 1577.4499999999998, 1583.0, 0.11204607334535961, 67.10985338421159, 0.23766022588488386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 151.09999999999997, 141, 165, 151.0, 163.20000000000002, 164.95, 165.0, 0.10708988589572657, 0.08314107352256117, 0.03806710787699656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e20cd225-281a-4ac6-b184-505ea7569bf9", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7eb316e8-509b-475d-8dfe-8fd5d55d7354", 3, 0, 0.0, 367.6666666666667, 236, 475, 392.0, 475.0, 475.0, 475.0, 0.056808498551383285, 0.036522390833001954, 0.03642992908405764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 483.26666666666665, 288, 1139, 301.0, 980.0000000000001, 1139.0, 1139.0, 0.08785287571746515, 7.133916609318261, 0.1960846444154855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 845.0714285714286, 142, 1725, 1148.0, 1604.0, 1725.0, 1725.0, 0.15650851853508027, 107.01143315688861, 0.24610571521598176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d81eb70-fe5e-4c94-8c29-161b0a7e3162", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 162.15000000000003, 138, 447, 149.0, 153.0, 432.2999999999998, 447.0, 0.12658708558552859, 0.0940749727837766, 0.06354078319429851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 201.45000000000002, 138, 442, 146.0, 431.8, 441.5, 442.0, 0.12658388080861782, 0.033871077481993445, 0.07219236952366487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d81eb70-fe5e-4c94-8c29-161b0a7e3162", 3, 0, 0.0, 336.6666666666667, 224, 549, 237.0, 549.0, 549.0, 549.0, 0.04414621225498852, 0.028381760808464298, 0.028309908249455527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 187.15, 137, 443, 144.0, 430.7, 442.4, 443.0, 0.12658788680511163, 0.03411939136544024, 0.07441983189128633], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 994.2608695652175, 222, 2015, 974.0, 1744.0, 1966.3999999999992, 2015.0, 0.09368177522890939, 0.029227822876274887, 0.0422665821833556], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 232.54999999999998, 137, 451, 147.5, 443.0, 450.6, 451.0, 0.1265854831767893, 0.034118743512493985, 0.07454203745664446], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 24.242424242424242, 0.6158583525789069], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.090909090909092, 0.23094688221709006], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.090909090909092, 0.23094688221709006], "isController": false}, {"data": ["401/Unauthorized", 19, 57.57575757575758, 1.4626635873749039], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 33, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 98.52289512555392, "KoPercent": 1.4771048744460857};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8134895503483217, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38524590163934425, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/141129af-1de5-44fc-9134-5b19c7048963"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ddfca73-9722-4fc7-ba9a-853ad5143c60"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28664574-7272-4290-8c45-fa58cb77cf24"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/245de525-e819-45de-bdbe-b2d0be6bb3b2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39f705c7-1256-448e-940d-6e571c236f85"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1de5e52-a0fb-49f5-8a3d-cd40188b4694"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/684fe032-3b9d-4a4f-991d-31c78cae1860"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d993e7a6-5a70-47cd-8c12-2f5159aca8a9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15198389-3c2c-4013-a7c4-cb392d1327ee"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/654c6b37-7214-44ec-bf6c-b1ea0f8ea131"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15198389-3c2c-4013-a7c4-cb392d1327ee"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a83b5028-9baf-4183-9944-ce6fdd40d76e"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47e06f99-d097-40f5-a3f3-76bb79c7bcec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c15bb644-fa8d-4591-8969-8218f3c0d813"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bfbff958-f5da-428c-84b6-29cfb75fa8c7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f32e305f-5ad2-478f-945f-813294b24c58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4918032786885246, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=245de525-e819-45de-bdbe-b2d0be6bb3b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=502dc355-3c92-464f-a299-ddf18d11d360"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28664574-7272-4290-8c45-fa58cb77cf24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d993e7a6-5a70-47cd-8c12-2f5159aca8a9"], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=141129af-1de5-44fc-9134-5b19c7048963"], "isController": false}, {"data": [0.9918032786885246, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8032786885245902, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9595375722543352, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81d99dfe-739b-49bd-9077-fd904a8a7912"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfbff958-f5da-428c-84b6-29cfb75fa8c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=654c6b37-7214-44ec-bf6c-b1ea0f8ea131"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/502dc355-3c92-464f-a299-ddf18d11d360"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1de5e52-a0fb-49f5-8a3d-cd40188b4694"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39f705c7-1256-448e-940d-6e571c236f85"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47e06f99-d097-40f5-a3f3-76bb79c7bcec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f32e305f-5ad2-478f-945f-813294b24c58"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a83b5028-9baf-4183-9944-ce6fdd40d76e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3fce2ffd-85dd-4699-838d-0c8bd9be5316"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1354, 20, 1.4771048744460857, 310.35450516986697, 77, 3023, 96.5, 844.5, 1064.0, 1656.2500000000011, 5.301010480653661, 771.5905140382326, 3.8695117694471524], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 61, 0, 0.0, 1324.9016393442628, 961, 2184, 1290.0, 1600.6, 1688.7, 2184.0, 0.26037220420010243, 313.3167310483183, 1.2802480938940584], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/141129af-1de5-44fc-9134-5b19c7048963", 3, 0, 0.0, 256.6666666666667, 178, 401, 191.0, 401.0, 401.0, 401.0, 0.08344691385496926, 0.03775755542265862, 0.05351250660621401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ddfca73-9722-4fc7-ba9a-853ad5143c60", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 1.101158405172414, 2.0575161637931036], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 547.6666666666667, 85, 1245, 468.0, 1057.8000000000002, 1245.0, 1245.0, 0.09192979015493234, 0.01800890225105413, 0.06189699803270249], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 547.6666666666667, 85, 1245, 468.0, 1057.8000000000002, 1245.0, 1245.0, 0.09099070681581055, 0.017824937292237886, 0.06126470637298911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 101.87500000000001, 78, 247, 81.0, 244.9, 247.0, 247.0, 0.0934366587050847, 0.03377269853830027, 0.052797643206278944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 92.0625, 80, 239, 81.0, 133.30000000000013, 239.0, 239.0, 0.09343720435884557, 0.06943917237996239, 0.046901096719186165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28664574-7272-4290-8c45-fa58cb77cf24", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 0.6187125428082192, 2.361140839041096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/245de525-e819-45de-bdbe-b2d0be6bb3b2", 3, 0, 0.0, 553.0, 308, 1017, 334.0, 1017.0, 1017.0, 1017.0, 0.031901657822818195, 0.03199511971097098, 0.020457768851221303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 163.9375, 78, 631, 82.0, 362.2000000000003, 631.0, 631.0, 0.0934366587050847, 1.740702596225159, 0.05451992536746886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39f705c7-1256-448e-940d-6e571c236f85", 3, 0, 0.0, 261.6666666666667, 179, 410, 196.0, 410.0, 410.0, 410.0, 0.018083727659061452, 0.024929878462280355, 0.011596661291780944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 163.6875, 78, 930, 81.5, 451.9000000000005, 930.0, 930.0, 0.09343720435884557, 5.278295276530327, 0.05442899648442519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1de5e52-a0fb-49f5-8a3d-cd40188b4694", 3, 0, 0.0, 612.3333333333334, 198, 1206, 433.0, 1206.0, 1206.0, 1206.0, 0.026452693765981833, 0.026530191892249363, 0.01696347874966934], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 208.3333333333333, 79, 375, 196.0, 334.8, 375.0, 375.0, 0.09286200705751255, 0.17232673497183185, 0.06002174518665263], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 103.9047619047619, 79, 241, 81.0, 235.0, 240.39999999999998, 241.0, 0.09676973411363532, 0.07191578873093406, 0.048573870443758355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 106.76190476190476, 78, 250, 81.0, 239.0, 249.0, 250.0, 0.09674521456706515, 0.03972564381636837, 0.054401187432335935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 553.8, 394, 654, 618.0, 654.0, 654.0, 654.0, 0.05593404257699321, 16.44646570264344, 0.03189988365719144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 812.6, 702, 1016, 741.0, 1016.0, 1016.0, 1016.0, 0.05572334473804456, 50.13996354648442, 0.03172530271707029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 179.2, 77, 255, 241.0, 255.0, 255.0, 255.0, 0.05602994240121921, 0.09914673401465743, 0.03102439193505009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/684fe032-3b9d-4a4f-991d-31c78cae1860", 1, 0, 0.0, 2687.0, 2687, 2687, 2687.0, 2687.0, 2687.0, 2687.0, 0.3721622627465575, 0.11884478507629327, 0.22206166263490884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 90.49999999999999, 78, 246, 81.5, 91.7, 238.2999999999999, 246.0, 0.08884387465906163, 0.06602557481986904, 0.044595460522224295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 111.95, 78, 243, 81.0, 241.20000000000002, 242.95, 243.0, 0.08878274418584005, 0.03042369622540163, 0.05026109062942526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 148.0, 78, 954, 81.5, 236.70000000000002, 918.1499999999995, 954.0, 0.08884663737689187, 4.019967622341819, 0.05185034228167049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 103.94999999999999, 78, 543, 81.0, 85.0, 520.0999999999997, 543.0, 0.08884821614994025, 1.3289662815466696, 0.05193802947983812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 112.4, 81, 231, 83.0, 231.0, 231.0, 231.0, 0.05612995206502094, 0.04171376320457123, 0.03151828363026078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 185.52380952380952, 78, 938, 82.0, 618.8000000000003, 915.1999999999997, 938.0, 0.09674209478882582, 8.313944725137281, 0.05608198259102971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 618.0666666666666, 77, 1028, 785.0, 1027.4, 1028.0, 1028.0, 0.0808764854314491, 48.522468751347944, 0.0429129789235879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 164.3333333333333, 78, 732, 84.0, 553.2000000000003, 721.6999999999998, 732.0, 0.09674699738783107, 2.732814738714002, 0.05617930414722128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 441.86666666666673, 80, 705, 616.0, 673.8000000000001, 705.0, 705.0, 0.08087517725143015, 15.860591076232941, 0.04299126446991713], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 450.0666666666666, 90, 1252, 386.0, 1106.2, 1252.0, 1252.0, 0.09110178498764053, 0.017846697332539734, 0.06194446890696078], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d993e7a6-5a70-47cd-8c12-2f5159aca8a9", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15198389-3c2c-4013-a7c4-cb392d1327ee", 3, 0, 0.0, 522.3333333333334, 185, 1019, 363.0, 1019.0, 1019.0, 1019.0, 0.047685656154628685, 0.030222647308939473, 0.030579668823118005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 248.85, 160, 1036, 166.5, 473.4000000000003, 1008.6999999999996, 1036.0, 0.08874846908890822, 5.4393668032468625, 0.19846203063153411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/654c6b37-7214-44ec-bf6c-b1ea0f8ea131", 3, 0, 0.0, 286.3333333333333, 207, 437, 215.0, 437.0, 437.0, 437.0, 0.04600803607030028, 0.030117890799926387, 0.029503851256019384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15198389-3c2c-4013-a7c4-cb392d1327ee", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a83b5028-9baf-4183-9944-ce6fdd40d76e", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 536.3478260869564, 121, 1470, 346.0, 1331.4000000000003, 1460.9999999999998, 1470.0, 0.10213597406634398, 0.06273782000754918, 0.04618062108663795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 82.00000000000001, 78, 90, 81.0, 88.2, 90.0, 90.0, 0.08087474120082816, 0.06010320122444358, 0.040595329079321944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 151.86666666666665, 77, 320, 83.0, 279.20000000000005, 320.0, 320.0, 0.08087561330673425, 0.10262146506173506, 0.04159618132312504], "isController": false}, {"data": ["login", 23, 0, 0.0, 2831.304347826087, 1683, 6181, 2580.0, 4454.000000000001, 5871.199999999995, 6181.0, 0.10133944307366938, 26.495940054139496, 0.1894305783508107], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/47e06f99-d097-40f5-a3f3-76bb79c7bcec", 3, 0, 0.0, 331.3333333333333, 290, 399, 305.0, 399.0, 399.0, 399.0, 0.04831851565519907, 0.031064149875982477, 0.030985506458574924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c15bb644-fa8d-4591-8969-8218f3c0d813", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.2188394561068703, 2.27740338740458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 88.38095238095238, 80, 102, 88.0, 96.60000000000001, 101.6, 102.0, 0.09564191666400994, 0.0774288563617815, 0.03399771256415979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfbff958-f5da-428c-84b6-29cfb75fa8c7", 3, 0, 0.0, 468.3333333333333, 219, 617, 569.0, 617.0, 617.0, 617.0, 0.01794033046088709, 0.024732193848260683, 0.011504704104149598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 701.3333333333334, 161, 1111, 868.0, 1111.0, 1111.0, 1111.0, 0.080839436710805, 64.51647554034427, 0.16802076933544594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 307.375, 162, 1011, 316.5, 644.2000000000004, 1011.0, 1011.0, 0.09339248190520663, 7.118811152010857, 0.20854842181298155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 550.7777777777778, 79, 1104, 786.0, 1104.0, 1104.0, 1104.0, 0.1002104419280489, 66.61554368340181, 0.15504564794401576], "isController": false}, {"data": ["register", 25, 6, 24.0, 1084.84, 161, 2103, 1086.0, 1637.8, 1965.5999999999997, 2103.0, 0.09885564702998094, 0.03121675978868617, 0.04460088762485468], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 307.1904761904762, 163, 1174, 171.0, 858.8000000000004, 1151.7999999999997, 1174.0, 0.09670556379343692, 11.154027103173323, 0.2151366009260709], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 95.84210526315788, 80, 244, 84.0, 110.0, 244.0, 244.0, 0.11162025613911408, 0.08665830432675362, 0.03967751292445071], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f32e305f-5ad2-478f-945f-813294b24c58", 3, 0, 0.0, 387.0, 166, 790, 205.0, 790.0, 790.0, 790.0, 0.02152991581802915, 0.025447631619552033, 0.013806619193202287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 237.73684210526318, 161, 412, 171.0, 329.0, 412.0, 412.0, 0.08799433131255123, 0.13637402714161992, 0.19790131348906786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 81.0, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.06529460927705809, 0.04852460708968868, 0.0327748331722733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 142.0, 79, 236, 83.0, 236.0, 236.0, 236.0, 0.0652954619653934, 0.01747163728370878, 0.03723881815213843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 142.2, 78, 238, 81.0, 238.0, 238.0, 238.0, 0.06529460927705809, 0.017598937656707062, 0.03838608865702048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 93.5, 90, 97, 93.5, 97.0, 97.0, 97.0, 0.04929751047572098, 0.014538914222331773, 0.030473949346807985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 111.6, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.0652971674088778, 0.017599627153174098, 0.03845135932378254], "isController": false}, {"data": ["https://demoqa.com/books", 61, 0, 0.0, 905.8032786885246, 626, 1813, 827.0, 1260.2, 1346.8, 1813.0, 0.2559820057239255, 306.24347258999234, 0.505464468333767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, 24.0, 1084.84, 161, 2103, 1086.0, 1637.8, 1965.5999999999997, 2103.0, 0.09790905423769969, 0.030917843533498603, 0.04417381157989966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 81.5, 80, 83, 81.5, 83.0, 83.0, 83.0, 0.01301278506132275, 0.0035073522235596474, 0.007662802140603143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 0.013012954396101319, 0.0035073978645741833, 0.007650193893020502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 187.73684210526318, 78, 857, 83.0, 692.0, 857.0, 857.0, 0.11165830208859792, 10.60275235878163, 0.06463280212385844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 180.05263157894737, 79, 627, 84.0, 477.0, 627.0, 627.0, 0.11166027068800358, 3.4829097344248616, 0.06474298487003333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 99.94736842105263, 79, 238, 83.0, 234.0, 238.0, 238.0, 0.11164649194970032, 0.08297166052121283, 0.056041305529439416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 79.5, 79, 80, 79.5, 80.0, 80.0, 80.0, 0.013013123735287038, 0.0034820272494811015, 0.007421547130280888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 113.94736842105264, 77, 244, 81.0, 241.0, 244.0, 244.0, 0.1116615831261717, 0.047531930070464336, 0.06269485680871195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 83.0, 80, 86, 83.0, 86.0, 86.0, 86.0, 0.013012531067417923, 0.009670445451469764, 0.006531680633450012], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 495.0, 80, 1019, 433.0, 1017.8, 1019.0, 1019.0, 0.09080672696233337, 0.017457829734360053, 0.061797051883936895], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 194.5, 85, 304, 194.5, 304.0, 304.0, 304.0, 0.013040189865164437, 0.010264055694650913, 0.00463537999113267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1727.782608695652, 1135, 3023, 1589.0, 2817.0000000000005, 3018.2, 3023.0, 0.10109179134654266, 0.05232289981803478, 0.04649827512131015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=245de525-e819-45de-bdbe-b2d0be6bb3b2", 1, 0, 0.0, 1009.0, 1009, 1009, 1009.0, 1009.0, 1009.0, 1009.0, 0.9910802775024776, 0.179052589197225, 0.6833033944499505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 166.0, 164, 168, 166.0, 168.0, 168.0, 168.0, 0.013005423261500046, 0.020155865933594308, 0.02924950172972129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=502dc355-3c92-464f-a299-ddf18d11d360", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28664574-7272-4290-8c45-fa58cb77cf24", 3, 0, 0.0, 294.3333333333333, 182, 448, 253.0, 448.0, 448.0, 448.0, 0.08549687936390322, 0.03868511143093277, 0.05482710037333637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d993e7a6-5a70-47cd-8c12-2f5159aca8a9", 3, 0, 0.0, 355.0, 265, 420, 380.0, 420.0, 420.0, 420.0, 0.03449029098308826, 0.028753136460836277, 0.022117797277566367], "isController": false}, {"data": ["addBook", 56, 6, 10.714285714285714, 869.3571428571427, 417, 1776, 704.5, 1467.0, 1530.1999999999998, 1776.0, 0.27233777665384407, 94.16600089300043, 0.9881172888288016], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=141129af-1de5-44fc-9134-5b19c7048963", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/books-0", 61, 0, 0.0, 141.9672131147541, 79, 575, 84.0, 328.20000000000005, 347.2, 575.0, 0.2571279232494225, 0.19108823202422903, 0.12429523633639077], "isController": false}, {"data": ["https://demoqa.com/books-3", 61, 0, 0.0, 514.8852459016395, 381, 724, 480.0, 644.0, 654.8, 724.0, 0.25710516444193426, 75.59745504084178, 0.1293058200074181], "isController": false}, {"data": ["https://demoqa.com/books-1", 61, 0, 0.0, 110.77049180327867, 78, 323, 84.0, 241.20000000000002, 247.0, 323.0, 0.25770256054954016, 0.4560127340974285, 0.12532800307975683], "isController": false}, {"data": ["https://demoqa.com/books-2", 61, 0, 0.0, 761.9016393442623, 542, 1202, 726.0, 999.8000000000002, 1092.6, 1202.0, 0.2566400350040179, 230.92515462167682, 0.12882126757037615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 98.63157894736842, 82, 243, 87.0, 116.0, 243.0, 243.0, 0.09292771202191137, 0.06942353486011933, 0.033032897632788806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 6, 3.468208092485549, 139.1618497109827, 79, 672, 88.0, 257.6, 301.89999999999975, 554.3399999999986, 0.7000250876042956, 1.614556146665372, 0.3319539576707374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 85.0, 81, 95, 83.0, 95.0, 95.0, 95.0, 0.06350980591403313, 0.049182886806472925, 0.022575751321003965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81d99dfe-739b-49bd-9077-fd904a8a7912", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 85.3125, 81, 90, 85.5, 90.0, 90.0, 90.0, 0.09787010190724361, 0.07942388152824165, 0.0347897627873405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 256.0, 163, 320, 314.0, 320.0, 320.0, 320.0, 0.06522561540368133, 0.10108696449769754, 0.14669393776824036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfbff958-f5da-428c-84b6-29cfb75fa8c7", 1, 0, 0.0, 1252.0, 1252, 1252, 1252.0, 1252.0, 1252.0, 1252.0, 0.7987220447284344, 0.1443003694089457, 0.5506814097444089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=654c6b37-7214-44ec-bf6c-b1ea0f8ea131", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/502dc355-3c92-464f-a299-ddf18d11d360", 3, 0, 0.0, 329.0, 207, 405, 375.0, 405.0, 405.0, 405.0, 0.07274843590862796, 0.03419555385809205, 0.04665182901692614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1de5e52-a0fb-49f5-8a3d-cd40188b4694", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 322.2105263157895, 163, 940, 318.0, 773.0, 940.0, 940.0, 0.11158944481314641, 14.207344888836356, 0.2479618866985382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39f705c7-1256-448e-940d-6e571c236f85", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47e06f99-d097-40f5-a3f3-76bb79c7bcec", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 101.8, 82, 242, 88.0, 136.90000000000003, 236.8499999999999, 242.0, 0.09054772317750069, 0.0750732587672833, 0.032186885973252206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 86.06666666666666, 82, 92, 85.0, 90.8, 92.0, 92.0, 0.0847883964253212, 0.06582692886536168, 0.030139625291813396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f32e305f-5ad2-478f-945f-813294b24c58", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a83b5028-9baf-4183-9944-ce6fdd40d76e", 3, 0, 0.0, 308.0, 185, 550, 189.0, 550.0, 550.0, 550.0, 0.02361219333663904, 0.027908813152778763, 0.015141933877987927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 83.57894736842105, 78, 107, 82.0, 91.0, 107.0, 107.0, 0.08802776117605089, 0.06541906860837375, 0.04418580980907242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 122.78947368421053, 78, 245, 82.0, 243.0, 245.0, 245.0, 0.08802816901408451, 0.023554412411971832, 0.05020356514084507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 110.47368421052632, 77, 321, 82.0, 240.0, 321.0, 321.0, 0.08802857685589721, 0.023726452355691048, 0.05175117506567395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fce2ffd-85dd-4699-838d-0c8bd9be5316", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 1.9121912425149699, 3.5729322604790417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 139.5789473684211, 78, 244, 82.0, 241.0, 244.0, 244.0, 0.08802898470148908, 0.02372656228282323, 0.0518373806396464], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.4431314623338257], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.14771048744460857], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.0, 0.14771048744460857], "isController": false}, {"data": ["401/Unauthorized", 10, 50.0, 0.7385524372230429], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1354, 20, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

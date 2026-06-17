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

    var data = {"OkPercent": 98.78048780487805, "KoPercent": 1.2195121951219512};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8189823874755382, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be07c935-b2cd-4f79-a95f-22c4d5a52c5a"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/322b7793-cbea-4c72-851c-8feaf26279c8"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/252a957f-f9a5-4ed9-94d5-56dbe2232b68"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5e89d71-b05f-41e5-9db2-fbecc8e59054"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/86061529-65ac-4079-8381-3aba9f32d3b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b3bb37a-811b-466f-ae2c-6f95d040d3ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=843b08f5-06af-4ef5-b7f8-22c16d1dbeba"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=358c0c86-ce09-48ae-b57f-409156807ba3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbbf5ebb-1ea5-48f6-82dd-4dabb31c74dc"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d4275a5-685d-445a-be08-e5cb215d4f66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5e89d71-b05f-41e5-9db2-fbecc8e59054"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d40cf25-e4d2-49e8-bf82-90256989d8e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cd48f1b-fa60-4265-9640-2913996fd349"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be07c935-b2cd-4f79-a95f-22c4d5a52c5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/880a7d42-9aa0-4055-b6f2-90a23a6a9da3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cbbf5ebb-1ea5-48f6-82dd-4dabb31c74dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=252a957f-f9a5-4ed9-94d5-56dbe2232b68"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=322b7793-cbea-4c72-851c-8feaf26279c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e8d33b0-17ab-4d13-bbfb-f84accf11a89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6547587b-5a99-490a-b321-6203a04aca93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d40cf25-e4d2-49e8-bf82-90256989d8e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b3bec4d-96e3-4239-b894-920a6b265024"], "isController": false}, {"data": [0.423728813559322, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86061529-65ac-4079-8381-3aba9f32d3b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9511494252873564, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b3bb37a-811b-466f-ae2c-6f95d040d3ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d4275a5-685d-445a-be08-e5cb215d4f66"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/843b08f5-06af-4ef5-b7f8-22c16d1dbeba"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/358c0c86-ce09-48ae-b57f-409156807ba3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6547587b-5a99-490a-b321-6203a04aca93"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cd48f1b-fa60-4265-9640-2913996fd349"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=880a7d42-9aa0-4055-b6f2-90a23a6a9da3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 16, 1.2195121951219512, 311.45274390243924, 77, 3511, 99.0, 804.0000000000005, 1011.3499999999999, 1666.9199999999983, 5.183742330076373, 721.839646059941, 3.7861836549136902], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/be07c935-b2cd-4f79-a95f-22c4d5a52c5a", 3, 0, 0.0, 471.33333333333337, 319, 746, 349.0, 746.0, 746.0, 746.0, 0.019184161556219187, 0.022675029495648393, 0.01230234318546608], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1344.5892857142858, 952, 1840, 1348.5, 1562.7000000000003, 1675.1499999999999, 1840.0, 0.2474383502931703, 297.75243872448846, 1.2166524352794066], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/322b7793-cbea-4c72-851c-8feaf26279c8", 3, 0, 0.0, 306.0, 173, 398, 347.0, 398.0, 398.0, 398.0, 0.02652027475004641, 0.02659797086747819, 0.01700681681562221], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 598.2000000000002, 83, 1137, 479.0, 1037.4, 1137.0, 1137.0, 0.08219763599598875, 0.015476273652369758, 0.055606486694942656], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 598.2000000000002, 83, 1137, 479.0, 1037.4, 1137.0, 1137.0, 0.08419965422008667, 0.015853216146125695, 0.05696084680995577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 137.31578947368422, 78, 239, 81.0, 238.0, 239.0, 239.0, 0.08815478123695078, 0.037525590985013686, 0.04949644481046722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 113.15789473684211, 78, 237, 81.0, 236.0, 237.0, 237.0, 0.08815314521142836, 0.06551224951747753, 0.04424874671745525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 194.52631578947364, 78, 617, 82.0, 613.0, 617.0, 617.0, 0.08815437222487717, 2.7497132083087816, 0.051113768147041494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 190.3157894736842, 78, 859, 80.0, 699.0, 859.0, 859.0, 0.08815437222487717, 8.37088654010328, 0.05102767989291564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/252a957f-f9a5-4ed9-94d5-56dbe2232b68", 3, 0, 0.0, 362.0, 190, 493, 403.0, 493.0, 493.0, 493.0, 0.020430817845638362, 0.02816553176311148, 0.013101793996063663], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 264.73333333333335, 79, 503, 208.0, 459.20000000000005, 503.0, 503.0, 0.08229504419243873, 0.1828225125637101, 0.05319710246007319], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f5e89d71-b05f-41e5-9db2-fbecc8e59054", 3, 0, 0.0, 307.3333333333333, 206, 413, 303.0, 413.0, 413.0, 413.0, 0.02423850690797447, 0.028649094590773208, 0.015543573765856024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 81.11764705882354, 78, 91, 80.0, 86.19999999999999, 91.0, 91.0, 0.08571356543222326, 0.0636992414979706, 0.04302419202359644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86061529-65ac-4079-8381-3aba9f32d3b0", 3, 0, 0.0, 1083.3333333333333, 430, 2351, 469.0, 2351.0, 2351.0, 2351.0, 0.02558831807985261, 0.02582987446797622, 0.016409175331155483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 98.23529411764706, 78, 236, 80.0, 235.2, 236.0, 236.0, 0.08571529412951076, 0.038081461672658336, 0.04803759245907095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 593.6, 470, 627, 624.0, 627.0, 627.0, 627.0, 0.1131068180789938, 33.257160015043205, 0.06450623218567615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 716.8, 687, 807, 695.0, 807.0, 807.0, 807.0, 0.1125188469068569, 101.24465623382542, 0.06406102319013435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b3bb37a-811b-466f-ae2c-6f95d040d3ae", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 239.2, 236, 248, 237.0, 248.0, 248.0, 248.0, 0.11370613785732155, 0.2012065642553385, 0.06296033219248175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 85.61538461538463, 78, 134, 81.0, 119.19999999999999, 134.0, 134.0, 0.07667626102958525, 0.05698304164405699, 0.03848788883711603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 127.9230769230769, 78, 236, 80.0, 236.0, 236.0, 236.0, 0.0766776178033632, 0.029376190714930313, 0.04323484068750332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 175.0769230769231, 79, 692, 81.0, 509.59999999999985, 692.0, 692.0, 0.07660803205751494, 5.321524693199565, 0.04453072055747076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 146.30769230769232, 77, 630, 80.0, 472.39999999999986, 630.0, 630.0, 0.07667671328217619, 1.7533462196905798, 0.04464552318585845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 112.8, 79, 236, 81.0, 236.0, 236.0, 236.0, 0.1137087237332848, 0.08450423707131811, 0.06385011342445192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 592.2666666666667, 78, 938, 775.0, 933.8, 938.0, 938.0, 0.08301464931844973, 49.80527660135258, 0.04404748645477639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 187.82352941176467, 77, 974, 81.0, 881.9999999999999, 974.0, 974.0, 0.08571486194865174, 9.094077024257306, 0.04952436129822722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 448.00000000000006, 77, 709, 615.0, 662.2, 709.0, 709.0, 0.08294487483618386, 16.266483565855467, 0.04409146504150009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 148.47058823529412, 78, 623, 80.0, 438.99999999999983, 623.0, 623.0, 0.08571486194865174, 2.9854454903898513, 0.04960806721809895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=843b08f5-06af-4ef5-b7f8-22c16d1dbeba", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.0323660714285714, 3.9397321428571432], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 572.2666666666668, 82, 2735, 426.0, 1544.6000000000008, 2735.0, 2735.0, 0.08436113313874032, 0.015883619598778452, 0.057762111798185675], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=358c0c86-ce09-48ae-b57f-409156807ba3", 1, 0, 0.0, 2735.0, 2735, 2735, 2735.0, 2735.0, 2735.0, 2735.0, 0.3656307129798903, 0.06605632998171847, 0.25208523765996343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbbf5ebb-1ea5-48f6-82dd-4dabb31c74dc", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 285.7692307692308, 159, 776, 313.0, 613.9999999999999, 776.0, 776.0, 0.07657103141179311, 7.156124283619101, 0.17070301226020015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 591.4761904761906, 108, 1291, 586.0, 1152.0, 1278.1, 1291.0, 0.0964089945000964, 0.05921997806695375, 0.04359117622416468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 108.73333333333335, 79, 318, 82.0, 268.20000000000005, 318.0, 318.0, 0.0830109740507695, 0.06169077270765195, 0.041667617834077665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d4275a5-685d-445a-be08-e5cb215d4f66", 3, 0, 0.0, 359.6666666666667, 326, 402, 351.0, 402.0, 402.0, 402.0, 0.04917146088410287, 0.03161251147334087, 0.03153247979872482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 196.79999999999998, 80, 246, 236.0, 244.8, 246.0, 246.0, 0.08294395753269374, 0.10524594611407559, 0.04265997815809118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5e89d71-b05f-41e5-9db2-fbecc8e59054", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["login", 21, 0, 0.0, 2698.380952380952, 1575, 5050, 2427.0, 3963.8, 4946.299999999998, 5050.0, 0.0931301027535467, 26.655681206511566, 0.17728240123774341], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d40cf25-e4d2-49e8-bf82-90256989d8e4", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 104.76470588235296, 81, 240, 83.0, 235.2, 240.0, 240.0, 0.08469467569412269, 0.06856629506877705, 0.030106310500645175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cd48f1b-fa60-4265-9640-2913996fd349", 3, 0, 0.0, 314.6666666666667, 194, 455, 295.0, 455.0, 455.0, 455.0, 0.023256895669566027, 0.027488863338604896, 0.014914089996433942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 722.9333333333335, 162, 1030, 863.0, 1022.2, 1030.0, 1030.0, 0.08290269986459226, 66.16312811748695, 0.1723091597120513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be07c935-b2cd-4f79-a95f-22c4d5a52c5a", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/880a7d42-9aa0-4055-b6f2-90a23a6a9da3", 3, 0, 0.0, 272.6666666666667, 171, 439, 208.0, 439.0, 439.0, 439.0, 0.06789327177676692, 0.0315155617036685, 0.04353832858080431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 359.0526315789474, 160, 938, 318.0, 779.0, 938.0, 938.0, 0.08812043744840316, 11.219317818822061, 0.19581161966523508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 615.7142857142858, 79, 931, 773.0, 931.0, 931.0, 931.0, 0.12765103853237778, 109.09191672593322, 0.2297647459744333], "isController": false}, {"data": ["register", 25, 7, 28.0, 1038.08, 119, 3285, 992.0, 1603.2000000000003, 2795.3999999999987, 3285.0, 0.09827507586835857, 0.030895226976115225, 0.044338950245294585], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 297.764705882353, 159, 1055, 165.0, 963.8, 1055.0, 1055.0, 0.08567900612352897, 12.176208365357962, 0.19011506029030065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbbf5ebb-1ea5-48f6-82dd-4dabb31c74dc", 3, 0, 0.0, 1299.0, 189, 3511, 197.0, 3511.0, 3511.0, 3511.0, 0.019380345745368097, 0.022906912565570172, 0.012428151405721078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 95.29411764705881, 79, 238, 85.0, 123.5999999999999, 238.0, 238.0, 0.11259844084276621, 0.08741773483398353, 0.04002522701832705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=252a957f-f9a5-4ed9-94d5-56dbe2232b68", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=322b7793-cbea-4c72-851c-8feaf26279c8", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.2656824448529412, 1.0139016544117647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e8d33b0-17ab-4d13-bbfb-f84accf11a89", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 241.07142857142858, 162, 318, 242.0, 318.0, 318.0, 318.0, 0.09695223717287275, 0.15025703163412996, 0.21804785371984958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 115.57142857142857, 78, 295, 84.0, 295.0, 295.0, 295.0, 0.034702770768368925, 0.025789852104227295, 0.01741916423334143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 102.42857142857143, 77, 239, 80.0, 239.0, 239.0, 239.0, 0.03470741647908134, 0.009286945425066688, 0.019794073460726078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 79.28571428571428, 78, 81, 79.0, 81.0, 81.0, 81.0, 0.03470827693238332, 0.00935496526693144, 0.02040467061845191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 113.85714285714286, 77, 319, 81.0, 319.0, 319.0, 319.0, 0.03470758856632868, 0.009354779730768276, 0.02043816006396113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 3.596608231707317, 7.53858612804878], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 919.9285714285716, 618, 1507, 861.0, 1222.6000000000001, 1337.65, 1507.0, 0.251467266595717, 300.8422750153799, 0.49654962212552706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1038.08, 119, 3285, 992.0, 1603.2000000000003, 2795.3999999999987, 3285.0, 0.10005523048722896, 0.0314548630844226, 0.04514210594248025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 92.15384615384616, 78, 236, 80.0, 174.79999999999995, 236.0, 236.0, 0.06001375699968147, 0.016175582941320394, 0.03534013229571086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 91.84615384615384, 78, 235, 80.0, 173.79999999999995, 235.0, 235.0, 0.06001347995088127, 0.01617550826801097, 0.03528136223674856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6547587b-5a99-490a-b321-6203a04aca93", 3, 0, 0.0, 358.3333333333333, 299, 417, 359.0, 417.0, 417.0, 417.0, 0.11811023622047244, 0.05344180610236221, 0.07574126476377953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 89.1764705882353, 78, 239, 80.0, 113.39999999999989, 239.0, 239.0, 0.10920186285530753, 0.029433314597719605, 0.06419875140517102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 107.11764705882352, 79, 236, 80.0, 233.6, 236.0, 236.0, 0.10920186285530753, 0.029433314597719605, 0.06430539384936566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 91.76923076923076, 78, 238, 80.0, 175.19999999999993, 238.0, 238.0, 0.06001375699968147, 0.016058368572180393, 0.034226595788880834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 82.0, 79, 89, 81.0, 88.2, 89.0, 89.0, 0.1091983556012333, 0.08115229356693217, 0.054812455838900306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 92.84615384615384, 79, 238, 80.0, 176.39999999999995, 238.0, 238.0, 0.06001347995088127, 0.04459986156505923, 0.030123953803469702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 80.11764705882354, 78, 87, 80.0, 82.19999999999999, 87.0, 87.0, 0.10920116138646933, 0.029219842011613865, 0.062278787353220795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 108.6923076923077, 81, 239, 86.0, 238.2, 239.0, 239.0, 0.05885122410546139, 0.04632235022363466, 0.02091977106873823], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 719.3333333333334, 81, 3511, 450.0, 2405.8000000000006, 3511.0, 3511.0, 0.08350358787082553, 0.015569939821747673, 0.05683245492197981], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1586.6190476190473, 719, 3432, 1437.0, 2704.8000000000006, 3374.999999999999, 3432.0, 0.09278364180212342, 0.04802278335461466, 0.04267685086796888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 198.23076923076923, 160, 477, 162.0, 414.19999999999993, 477.0, 477.0, 0.059991047489836136, 0.09297440660778314, 0.134921271844817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d40cf25-e4d2-49e8-bf82-90256989d8e4", 3, 0, 0.0, 343.0, 286, 388, 355.0, 388.0, 388.0, 388.0, 0.01622428450905315, 0.02236648596869795, 0.010404244948839424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b3bec4d-96e3-4239-b894-920a6b265024", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["addBook", 59, 5, 8.474576271186441, 937.8983050847461, 415, 2774, 794.0, 1464.0, 2181.0, 2774.0, 0.28581393996938403, 88.03172008672516, 1.0400588371005872], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 146.49999999999997, 79, 338, 81.5, 321.3, 324.15, 338.0, 0.2525275300101913, 0.1876693850954644, 0.12207141343266083], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 509.55357142857144, 386, 714, 468.5, 630.6, 710.0, 714.0, 0.25240346694190663, 74.21499986478386, 0.1269411967530097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86061529-65ac-4079-8381-3aba9f32d3b0", 1, 0, 0.0, 751.0, 751, 751, 751.0, 751.0, 751.0, 751.0, 1.3315579227696406, 0.2405646637816245, 0.9180467709720372], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 116.73214285714288, 78, 325, 82.5, 237.0, 239.0, 325.0, 0.2526642543246194, 0.4470972937853617, 0.12287773306021531], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 771.7142857142857, 538, 1169, 768.0, 945.6, 1019.15, 1169.0, 0.2518733077262137, 226.63604503809583, 0.1264285939172596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 84.07142857142857, 81, 96, 83.0, 92.0, 96.0, 96.0, 0.09738249758282728, 0.07275157290123328, 0.034616434687645636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, 2.8735632183908044, 176.44827586206893, 79, 2444, 89.0, 343.5, 459.0, 1727.75, 0.7668711656441718, 1.6424529988408787, 0.3692969121866406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 90.42857142857143, 82, 115, 85.0, 115.0, 115.0, 115.0, 0.03687063148857273, 0.028553135518006034, 0.01310635728695359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b3bb37a-811b-466f-ae2c-6f95d040d3ae", 3, 0, 0.0, 349.3333333333333, 273, 459, 316.0, 459.0, 459.0, 459.0, 0.05980861244019139, 0.0384511749900319, 0.03835383024322169], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d4275a5-685d-445a-be08-e5cb215d4f66", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/843b08f5-06af-4ef5-b7f8-22c16d1dbeba", 3, 0, 0.0, 409.0, 274, 503, 450.0, 503.0, 503.0, 503.0, 0.07376807317792859, 0.03337813206944035, 0.04730569796891905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/358c0c86-ce09-48ae-b57f-409156807ba3", 3, 0, 0.0, 676.6666666666667, 173, 1669, 188.0, 1669.0, 1669.0, 1669.0, 0.024413267797272223, 0.02928479551853781, 0.015655643737183034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 88.73684210526316, 81, 129, 85.0, 101.0, 129.0, 129.0, 0.08971955555765425, 0.07280952213711982, 0.031892498264634916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 231.14285714285717, 159, 615, 165.0, 615.0, 615.0, 615.0, 0.034688669193983994, 0.05376066211997324, 0.07801563003295424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 199.76470588235293, 160, 319, 164.0, 318.2, 319.0, 319.0, 0.10914227015921932, 0.16914920189714946, 0.2454635236100411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6547587b-5a99-490a-b321-6203a04aca93", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cd48f1b-fa60-4265-9640-2913996fd349", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.28586085838607594, 1.0909068433544304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 108.3076923076923, 82, 313, 86.0, 233.39999999999992, 313.0, 313.0, 0.07875876191226273, 0.06529901256202252, 0.027996278648499646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 85.86666666666666, 80, 110, 83.0, 103.4, 110.0, 110.0, 0.08318268025686812, 0.06458030351973648, 0.02956884337255859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=880a7d42-9aa0-4055-b6f2-90a23a6a9da3", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 81.85714285714286, 79, 88, 80.5, 87.5, 88.0, 88.0, 0.09701068503402303, 0.07209485479579252, 0.0486948165112186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 112.64285714285711, 78, 236, 79.5, 236.0, 236.0, 236.0, 0.09701673538685424, 0.025959556148435602, 0.055329856900315305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 112.92857142857143, 78, 234, 80.0, 234.0, 234.0, 234.0, 0.09701135725818187, 0.026147592385994334, 0.05703206745061083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 157.71428571428572, 79, 237, 158.0, 236.5, 237.0, 237.0, 0.09701606308815988, 0.02614886075423059, 0.05712957621304727], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 43.75, 0.5335365853658537], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07621951219512195], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07621951219512195], "isController": false}, {"data": ["401/Unauthorized", 7, 43.75, 0.5335365853658537], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 16, "406/Not Acceptable", 7, "401/Unauthorized", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

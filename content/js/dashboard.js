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

    var data = {"OkPercent": 98.38212634822804, "KoPercent": 1.617873651771957};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7868473231989425, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1111111111111111, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8842adf-e71d-479b-a1c1-ad11c00d91ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0896c12f-7897-4387-97d7-4d6a7e1792a0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/383987b7-3776-4931-bea9-81304d9fcc58"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/161cdd2d-9057-4223-9d6f-e2e05c51d1f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/96131af2-1b8f-4fc2-9b9b-1908ede83475"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=800b17e8-6c14-41b8-aa95-04c6c5c3b8c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf3a9857-f97b-4de4-a90c-65f41382428d"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0423603f-e502-45da-8cba-968665050658"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d4feda6-f5ef-4232-96ef-b886d5db6f5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c162b2c-5857-42d5-b7ff-43892a804391"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40c0b7b0-ca68-4b48-b5e4-170c110c1385"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a8842adf-e71d-479b-a1c1-ad11c00d91ae"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4d618fc-dc4c-483c-a268-a6a8a889f25a"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4b44687-8eb7-453d-9983-6657b9b941fa"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4d618fc-dc4c-483c-a268-a6a8a889f25a"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d4feda6-f5ef-4232-96ef-b886d5db6f5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e0bf3e7-de41-449e-bf88-fc3c3cba5c58"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0896c12f-7897-4387-97d7-4d6a7e1792a0"], "isController": false}, {"data": [0.28688524590163933, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0423603f-e502-45da-8cba-968665050658"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9232954545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6c162b2c-5857-42d5-b7ff-43892a804391"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6e0bf3e7-de41-449e-bf88-fc3c3cba5c58"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=161cdd2d-9057-4223-9d6f-e2e05c51d1f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40c0b7b0-ca68-4b48-b5e4-170c110c1385"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/800b17e8-6c14-41b8-aa95-04c6c5c3b8c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=383987b7-3776-4931-bea9-81304d9fcc58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/314e337f-b314-4ade-ad23-518b79276f88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b94c2ff-f66e-4ca4-baf8-2ee80e419e3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bf3a9857-f97b-4de4-a90c-65f41382428d"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4b44687-8eb7-453d-9983-6657b9b941fa"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 21, 1.617873651771957, 363.1224961479196, 98, 2964, 114.0, 1070.0, 1215.1999999999998, 1713.1599999999999, 5.092572612317121, 697.9315492756914, 3.7210226291877384], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1708.1666666666663, 1233, 2162, 1710.0, 2093.5, 2144.75, 2162.0, 0.23926306974518483, 287.9143565941899, 1.1764546446943414], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8842adf-e71d-479b-a1c1-ad11c00d91ae", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0896c12f-7897-4387-97d7-4d6a7e1792a0", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 599.9333333333334, 106, 1348, 484.0, 1146.4, 1348.0, 1348.0, 0.07391310775052848, 0.014479462319097669, 0.04976623439817484], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 599.9333333333334, 106, 1348, 484.0, 1146.4, 1348.0, 1348.0, 0.07344732357952877, 0.014388215927786592, 0.04945261851949782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 128.06666666666666, 98, 305, 101.0, 304.4, 305.0, 305.0, 0.0663552394097038, 0.017755210545174645, 0.03784322247584669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 103.26666666666668, 100, 107, 103.0, 106.4, 107.0, 107.0, 0.06635318473168984, 0.04931130232501559, 0.033306188429774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 127.80000000000001, 98, 304, 102.0, 299.8, 304.0, 304.0, 0.06635435881783075, 0.017884573275118443, 0.039073904655421814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 148.1333333333333, 98, 408, 102.0, 344.40000000000003, 408.0, 408.0, 0.06635465234585813, 0.01788465239009458, 0.03900927803926426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/383987b7-3776-4931-bea9-81304d9fcc58", 2, 0, 0.0, 318.5, 221, 416, 318.5, 416.0, 416.0, 416.0, 0.05267871253226571, 0.046505425907390825, 0.032744141139440554], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 382.2, 102, 2802, 207.0, 1382.400000000001, 2802.0, 2802.0, 0.07403203119216248, 0.14806888217802236, 0.047850911827850846], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/161cdd2d-9057-4223-9d6f-e2e05c51d1f6", 3, 0, 0.0, 584.0, 219, 1198, 335.0, 1198.0, 1198.0, 1198.0, 0.06625734352224039, 0.02997972249215955, 0.04248924698529087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 113.83333333333334, 99, 311, 103.0, 125.60000000000029, 311.0, 311.0, 0.10703009329456466, 0.07954091894254268, 0.053724089798248276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 145.38888888888889, 99, 307, 102.0, 303.4, 307.0, 307.0, 0.10690804126650393, 0.04644746063705314, 0.0599733695038873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 675.2, 491, 805, 779.0, 805.0, 805.0, 805.0, 0.03163095531811252, 9.300551110088376, 0.018039529204861043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1081.2, 894, 1203, 1109.0, 1203.0, 1203.0, 1203.0, 0.03156545728877974, 28.4026539545994, 0.01797134921812362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 142.2, 103, 293, 104.0, 293.0, 293.0, 293.0, 0.03177003577306028, 0.05621807111404807, 0.017591416292309744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 102.93333333333334, 99, 108, 103.0, 108.0, 108.0, 108.0, 0.10451432194591732, 0.07767128808676083, 0.05246129050800929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 139.73333333333332, 98, 301, 101.0, 301.0, 301.0, 301.0, 0.1045172348920337, 0.038431858246758224, 0.05902229788108726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 219.26666666666665, 99, 1205, 103.0, 697.4000000000003, 1205.0, 1205.0, 0.10451650664028206, 6.295901526724871, 0.060845481925612115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 148.13333333333333, 98, 600, 102.0, 420.60000000000014, 600.0, 600.0, 0.10451432194591732, 2.0750039410608903, 0.060946274848280045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 143.2, 100, 306, 103.0, 306.0, 306.0, 306.0, 0.03177003577306028, 0.023610348850877805, 0.01783961969678678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 739.9411764705883, 101, 1408, 999.0, 1300.8, 1408.0, 1408.0, 0.0772558714462299, 40.899732316926304, 0.04151260463626118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 257.6111111111111, 99, 1204, 102.5, 1200.4, 1204.0, 1204.0, 0.10703072971173057, 10.726358193945629, 0.061900367769479596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96131af2-1b8f-4fc2-9b9b-1908ede83475", 1, 0, 0.0, 1360.0, 1360, 1360, 1360.0, 1360.0, 1360.0, 1360.0, 0.7352941176470588, 0.23480583639705882, 0.4387350643382353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 509.88235294117646, 98, 916, 598.0, 889.6, 916.0, 916.0, 0.07725727581756375, 13.371047381432804, 0.04158880581838178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 198.22222222222226, 98, 777, 102.0, 600.6000000000003, 777.0, 777.0, 0.10703200256876806, 3.522416700857445, 0.06200562735619061], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 386.6428571428571, 105, 654, 423.0, 633.5, 654.0, 654.0, 0.06997096205074894, 0.01321229033701014, 0.047885400996086624], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 350.06666666666666, 202, 1309, 209.0, 798.4000000000003, 1309.0, 1309.0, 0.10443864229765012, 8.480730526544821, 0.2331035139251523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=800b17e8-6c14-41b8-aa95-04c6c5c3b8c3", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf3a9857-f97b-4de4-a90c-65f41382428d", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 614.904761904762, 119, 2172, 509.0, 1269.6000000000001, 2083.9999999999986, 2172.0, 0.09039839865693808, 0.05552792261251372, 0.04087349470523665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 121.47058823529412, 99, 419, 102.0, 176.5999999999998, 419.0, 419.0, 0.07725060550842258, 0.05740987382022421, 0.03877618284309493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 160.4705882352941, 99, 309, 102.0, 305.8, 309.0, 309.0, 0.0772558714462299, 0.08892768566403694, 0.040243350314476845], "isController": false}, {"data": ["login", 21, 0, 0.0, 2836.333333333333, 1518, 5182, 2793.0, 4853.4000000000015, 5181.2, 5182.0, 0.09179244417052414, 26.27281680823466, 0.17473603525485518], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0423603f-e502-45da-8cba-968665050658", 3, 0, 0.0, 844.0, 180, 1922, 430.0, 1922.0, 1922.0, 1922.0, 0.036456877589957346, 0.030392598798138267, 0.023378922152414053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d4feda6-f5ef-4232-96ef-b886d5db6f5a", 3, 0, 0.0, 316.3333333333333, 196, 550, 203.0, 550.0, 550.0, 550.0, 0.06162441970338113, 0.03833472202251345, 0.03951826393738959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 144.0, 100, 366, 106.0, 310.2000000000001, 366.0, 366.0, 0.1030939644211274, 0.08346181299327597, 0.03664668266532262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c162b2c-5857-42d5-b7ff-43892a804391", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40c0b7b0-ca68-4b48-b5e4-170c110c1385", 3, 0, 0.0, 276.3333333333333, 180, 441, 208.0, 441.0, 441.0, 441.0, 0.020319146054021835, 0.02801158318319742, 0.013030181551569993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8842adf-e71d-479b-a1c1-ad11c00d91ae", 3, 0, 0.0, 1054.6666666666667, 270, 2442, 452.0, 2442.0, 2442.0, 2442.0, 0.08126777732629012, 0.036771552891778414, 0.05211507855885142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 863.9411764705881, 202, 1512, 1102.0, 1404.0, 1512.0, 1512.0, 0.07721481616060681, 54.387959917845706, 0.1620366756182863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4d618fc-dc4c-483c-a268-a6a8a889f25a", 3, 0, 0.0, 277.0, 189, 443, 199.0, 443.0, 443.0, 443.0, 0.018855946851371142, 0.025982168952426447, 0.012091866958724332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 293.8, 205, 509, 209.0, 449.6, 509.0, 509.0, 0.06632267306901538, 0.10278718960989004, 0.14916124616986562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 804.25, 102, 1429, 1089.5, 1429.0, 1429.0, 1429.0, 0.050471912380760105, 37.74378574436607, 0.08356329927004998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4b44687-8eb7-453d-9983-6657b9b941fa", 3, 0, 0.0, 287.0, 209, 435, 217.0, 435.0, 435.0, 435.0, 0.062436262981539675, 0.028250783054798227, 0.040038879581260796], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1022.318181818182, 285, 2933, 988.0, 1449.3999999999999, 2715.499999999997, 2933.0, 0.09322270905192505, 0.02947969545835911, 0.042059464435536494], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 120.6, 100, 307, 106.0, 196.00000000000006, 307.0, 307.0, 0.08540438978563498, 0.06630516589802717, 0.030358591681612437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 405.0, 203, 1307, 207.5, 1300.7, 1307.0, 1307.0, 0.106842680089273, 14.349519133743293, 0.23725428038487106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4d618fc-dc4c-483c-a268-a6a8a889f25a", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.29472114600326266, 1.124719616639478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 382.8125, 204, 1206, 405.5, 651.6000000000006, 1206.0, 1206.0, 0.08294883093991394, 6.322747299302712, 0.18522741264451242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 137.66666666666666, 98, 306, 104.0, 305.7, 306.0, 306.0, 0.05968991091280796, 0.04435939668422545, 0.02996153731365556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 119.16666666666667, 99, 309, 102.0, 249.00000000000023, 309.0, 309.0, 0.05969139548534079, 0.02344325151466916, 0.03362498694250724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 240.33333333333331, 99, 1160, 104.5, 903.200000000001, 1160.0, 1160.0, 0.059691692408709016, 4.49063885811036, 0.034664706789432585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 176.75, 99, 600, 103.5, 510.3000000000003, 600.0, 600.0, 0.05969139548534079, 1.4773523228657839, 0.03472282673577604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 2.808779761904762, 5.887276785714286], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1174.574074074074, 784, 1729, 1112.5, 1665.0, 1712.25, 1729.0, 0.22896782154078385, 273.925116656985, 0.4521220069877587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1022.318181818182, 285, 2933, 988.0, 1449.3999999999999, 2715.499999999997, 2933.0, 0.08925709695349299, 0.028225655126805933, 0.04027029178956422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 129.85714285714283, 98, 303, 102.0, 303.0, 303.0, 303.0, 0.05045554146003921, 0.013599345159151194, 0.029711612793362936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 159.2857142857143, 99, 308, 102.0, 308.0, 308.0, 308.0, 0.050455905142898334, 0.013599443183046815, 0.029662553609399213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 141.2, 99, 304, 102.0, 301.6, 304.0, 304.0, 0.08349382702305544, 0.02250419556480791, 0.04908523815222594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 140.73333333333332, 98, 304, 102.0, 298.6, 304.0, 304.0, 0.08358827757995219, 0.02252965294147149, 0.04922239392647575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 104.4, 100, 115, 104.0, 110.8, 115.0, 115.0, 0.0835868802032833, 0.06211876546357283, 0.04195669572703868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 129.28571428571428, 98, 294, 102.0, 294.0, 294.0, 294.0, 0.05045517778242285, 0.013500701867562366, 0.028775218579038038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 141.53333333333333, 98, 304, 102.0, 302.8, 304.0, 304.0, 0.08358781178253795, 0.02236626994962441, 0.04767117390722867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 102.42857142857143, 100, 104, 103.0, 104.0, 104.0, 104.0, 0.05045372312438284, 0.03749539384536654, 0.025325403990168728], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 500.84615384615387, 106, 1198, 445.0, 949.1999999999998, 1198.0, 1198.0, 0.06898747611971981, 0.012924787067501593, 0.04695211340479728], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 112.85714285714286, 103, 135, 106.0, 135.0, 135.0, 135.0, 0.04815630159603742, 0.03790427645156852, 0.017118060332966426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1349.714285714286, 804, 2785, 1219.0, 2154.0, 2726.7999999999993, 2785.0, 0.09080884737627294, 0.04700067295842252, 0.04176852257248492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d4feda6-f5ef-4232-96ef-b886d5db6f5a", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 263.7142857142857, 204, 409, 208.0, 409.0, 409.0, 409.0, 0.05041702078621743, 0.07813653514426469, 0.11338906139712766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e0bf3e7-de41-449e-bf88-fc3c3cba5c58", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0896c12f-7897-4387-97d7-4d6a7e1792a0", 3, 0, 0.0, 459.6666666666667, 188, 769, 422.0, 769.0, 769.0, 769.0, 0.024422608823074482, 0.028866696821804504, 0.01566163391323461], "isController": false}, {"data": ["addBook", 61, 10, 16.39344262295082, 1108.6557377049182, 520, 4478, 828.0, 1885.0000000000002, 1991.8999999999999, 4478.0, 0.2776715646109867, 82.70487381875785, 1.010871368078695], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0423603f-e502-45da-8cba-968665050658", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 178.6296296296296, 100, 416, 104.0, 410.0, 414.25, 416.0, 0.22983320068268973, 0.17080377511672548, 0.11110101009563615], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 648.7592592592595, 489, 915, 603.0, 810.0, 831.25, 915.0, 0.22977941176470587, 67.56277645335477, 0.11556288775275735], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 148.14814814814815, 99, 311, 105.0, 303.5, 305.25, 311.0, 0.22998198474452836, 0.4069603089424662, 0.11184670742458508], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 994.3888888888889, 681, 1312, 1000.5, 1255.5, 1305.0, 1312.0, 0.22940749142908123, 206.4212640432433, 0.11515180722123804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 106.4375, 100, 119, 106.0, 113.4, 119.0, 119.0, 0.08327521417344146, 0.06221244027605734, 0.029601736288215517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 10, 5.681818181818182, 194.13636363636363, 100, 2964, 108.0, 300.0, 356.3, 2222.4899999999902, 0.735152836603928, 1.4846845225787992, 0.3562242657347769], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 109.41666666666666, 103, 123, 107.0, 120.60000000000001, 123.0, 123.0, 0.0589640024764881, 0.04566255269907721, 0.02095986025531413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 106.86666666666665, 100, 118, 104.0, 117.4, 118.0, 118.0, 0.06655485451108804, 0.05401082431515055, 0.023658170939488327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c162b2c-5857-42d5-b7ff-43892a804391", 3, 0, 0.0, 511.3333333333333, 436, 576, 522.0, 576.0, 576.0, 576.0, 0.017525207089530443, 0.024159912768281715, 0.011238495431762686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e0bf3e7-de41-449e-bf88-fc3c3cba5c58", 3, 0, 0.0, 578.0, 204, 964, 566.0, 964.0, 964.0, 964.0, 0.01889739971779883, 0.026051591082317072, 0.012118449688822818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 379.41666666666663, 206, 1271, 211.5, 1072.7000000000007, 1271.0, 1271.0, 0.05965934513925485, 6.032531782583946, 0.1329032319207326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=161cdd2d-9057-4223-9d6f-e2e05c51d1f6", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.27624474388379205, 1.0542096712538225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40c0b7b0-ca68-4b48-b5e4-170c110c1385", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 274.26666666666665, 203, 410, 209.0, 408.8, 410.0, 410.0, 0.08344505699297393, 0.12932354047641564, 0.18766988892072164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/800b17e8-6c14-41b8-aa95-04c6c5c3b8c3", 3, 0, 0.0, 864.3333333333334, 207, 1941, 445.0, 1941.0, 1941.0, 1941.0, 0.015772041427895483, 0.02174303237211503, 0.010114232295883497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=383987b7-3776-4931-bea9-81304d9fcc58", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 156.86666666666665, 103, 425, 108.0, 357.20000000000005, 425.0, 425.0, 0.10747834311386256, 0.08911046221061457, 0.03820519227875584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 108.11764705882354, 101, 139, 104.0, 122.99999999999999, 139.0, 139.0, 0.07884643034381682, 0.06121378137044372, 0.028027442036278633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/314e337f-b314-4ade-ad23-518b79276f88", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b94c2ff-f66e-4ca4-baf8-2ee80e419e3d", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 103.1875, 100, 114, 103.0, 107.0, 114.0, 114.0, 0.08308192396965433, 0.06174350013760444, 0.0417032313675804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 152.5625, 99, 306, 102.5, 305.3, 306.0, 306.0, 0.08307976696125367, 0.030029197994662124, 0.046945341951128323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf3a9857-f97b-4de4-a90c-65f41382428d", 3, 0, 0.0, 1175.3333333333333, 277, 2802, 447.0, 2802.0, 2802.0, 2802.0, 0.08015175398754976, 0.03626658139410617, 0.051399399529776374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 202.31250000000003, 100, 1106, 103.0, 544.6000000000006, 1106.0, 1106.0, 0.08308192396965433, 4.693322428289915, 0.048396843406151184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4b44687-8eb7-453d-9983-6657b9b941fa", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 219.875, 99, 589, 198.0, 393.7000000000002, 589.0, 589.0, 0.08299228690433583, 1.5461264484747574, 0.048425675220059236], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 23.80952380952381, 0.3852080123266564], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15408320493066255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07704160246533127], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 1.0015408320493067], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 21, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

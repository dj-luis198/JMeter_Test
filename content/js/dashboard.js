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

    var data = {"OkPercent": 98.39939024390245, "KoPercent": 1.600609756097561};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7852459016393443, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aaf0c589-ec33-4c07-82e2-dc85da874184"], "isController": false}, {"data": [0.19642857142857142, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b20e5978-991f-4aff-8553-eea3230bfae1"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be4973b4-f0fd-4721-9ddc-a83f1e7219de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e0dcdd1-b364-4ecb-881c-11ab9615239b"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3a7a764-4a21-4344-b7e8-bb8391512f07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a8b6467-28fa-4563-8be4-ba530605cf14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b8aca2b-ddc4-4413-be92-a9023bd962bf"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5869565217391305, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d79587c8-c6b0-4fca-b4fd-53d6e9191f04"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b887035c-3471-4f79-a8ed-a803d7e04017"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d82f15d2-0b6e-435f-b30d-44b8a0820783"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7dce22a-02d0-4882-a4a1-e37ab990b2e3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e80600ee-db61-470d-8eba-a13239b4e21c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9649f1d-cf51-4151-ac1b-42dad95a5b3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d94f3d1e-2579-4b80-b86d-692f2136b65c"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9aeba4cc-25b6-4926-bc1d-94e1f207bafa"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be4973b4-f0fd-4721-9ddc-a83f1e7219de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3334a92b-b518-45f2-b479-2f6e69893131"], "isController": false}, {"data": [0.3220338983050847, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b20e5978-991f-4aff-8553-eea3230bfae1"], "isController": false}, {"data": [0.6607142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9425287356321839, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b8aca2b-ddc4-4413-be92-a9023bd962bf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a8b6467-28fa-4563-8be4-ba530605cf14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7dce22a-02d0-4882-a4a1-e37ab990b2e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d79587c8-c6b0-4fca-b4fd-53d6e9191f04"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3a7a764-4a21-4344-b7e8-bb8391512f07"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b887035c-3471-4f79-a8ed-a803d7e04017"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5cd7c1d-c364-46d7-8fcc-f8765847cd1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9649f1d-cf51-4151-ac1b-42dad95a5b3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d82f15d2-0b6e-435f-b30d-44b8a0820783"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e80600ee-db61-470d-8eba-a13239b4e21c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 21, 1.600609756097561, 355.1753048780489, 82, 3288, 118.0, 968.9000000000003, 1205.199999999999, 1865.2199999999993, 5.07072737110613, 706.0576578744589, 3.707733118912808], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/aaf0c589-ec33-4c07-82e2-dc85da874184", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1587.214285714286, 1171, 1980, 1555.5, 1899.6, 1972.45, 1980.0, 0.24737932527289033, 297.682718690502, 1.216362209715823], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b20e5978-991f-4aff-8553-eea3230bfae1", 3, 0, 0.0, 761.0, 183, 1148, 952.0, 1148.0, 1148.0, 1148.0, 0.08164820510029122, 0.03694368655254062, 0.05235903777590289], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 606.076923076923, 85, 1213, 517.0, 1160.6, 1213.0, 1213.0, 0.08248573948465449, 0.016352153432993025, 0.055457284283928605], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 606.076923076923, 85, 1213, 517.0, 1160.6, 1213.0, 1213.0, 0.08295048494129657, 0.01644428558894844, 0.05576974460821848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 125.3, 85, 328, 95.5, 319.40000000000003, 327.7, 328.0, 0.1007886713533399, 0.0269688437019679, 0.05748103913120165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 119.35, 84, 422, 98.0, 246.0000000000003, 413.9499999999999, 422.0, 0.10078613182826043, 0.07490063117315057, 0.05058991382785729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 150.5, 83, 294, 99.0, 292.9, 293.95, 294.0, 0.1007029062858754, 0.027142580209864854, 0.05930063719763952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 142.90000000000003, 82, 343, 98.0, 298.1, 340.79999999999995, 343.0, 0.10070087811165714, 0.027142033553532587, 0.05920110217111093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be4973b4-f0fd-4721-9ddc-a83f1e7219de", 3, 0, 0.0, 324.3333333333333, 276, 395, 302.0, 395.0, 395.0, 395.0, 0.021214756984958737, 0.02924625515341805, 0.013604515384234607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e0dcdd1-b364-4ecb-881c-11ab9615239b", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 346.92307692307696, 82, 2119, 198.0, 1384.9999999999993, 2119.0, 2119.0, 0.08270246198867612, 0.16591435921496278, 0.05345342420001272], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e3a7a764-4a21-4344-b7e8-bb8391512f07", 3, 0, 0.0, 368.6666666666667, 206, 571, 329.0, 571.0, 571.0, 571.0, 0.024856248032213698, 0.024929069071370574, 0.015939716348782874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 106.3125, 84, 310, 94.5, 163.70000000000016, 310.0, 310.0, 0.08253506450631136, 0.0613370938372099, 0.041428733551019566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 130.9375, 83, 294, 99.0, 287.7, 294.0, 294.0, 0.08246657526621241, 0.037548867888546424, 0.04616598073374635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 715.1666666666667, 608, 879, 689.0, 879.0, 879.0, 879.0, 0.046045815586508575, 13.538998647404167, 0.02626050420168067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 852.0, 563, 1021, 886.5, 1021.0, 1021.0, 1021.0, 0.04599992333346111, 41.390811874688545, 0.026189409475984207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 145.83333333333334, 85, 263, 102.0, 263.0, 263.0, 263.0, 0.04622994776015903, 0.08180533724746891, 0.025598027714853682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 112.35000000000001, 84, 292, 99.5, 217.10000000000025, 288.84999999999997, 292.0, 0.09881569390850654, 0.07343627252380223, 0.04960084635641833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 119.65, 82, 296, 91.0, 289.5000000000001, 295.9, 296.0, 0.09882350615917503, 0.026443008483998005, 0.0563602808564045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 134.00000000000003, 84, 313, 97.5, 281.70000000000005, 311.54999999999995, 313.0, 0.09882399446585631, 0.026636154758375333, 0.05809769987152881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 119.55, 84, 348, 87.5, 257.1, 343.49999999999994, 348.0, 0.09869476177551877, 0.02660132250980779, 0.058118106787732236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a8b6467-28fa-4563-8be4-ba530605cf14", 1, 0, 0.0, 918.0, 918, 918, 918.0, 918.0, 918.0, 918.0, 1.0893246187363836, 0.19680181100217864, 0.751038262527233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 117.5, 85, 232, 95.0, 232.0, 232.0, 232.0, 0.046230660173827286, 0.03435696522683844, 0.025959599218701845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b8aca2b-ddc4-4413-be92-a9023bd962bf", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 688.7647058823529, 84, 1251, 984.0, 1174.1999999999998, 1251.0, 1251.0, 0.07680387452957627, 40.66044237619893, 0.04126972899526979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 251.12499999999994, 83, 1189, 98.0, 1019.6000000000001, 1189.0, 1189.0, 0.08253293579969256, 9.302374643431927, 0.047633754939080376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 449.94117647058823, 84, 885, 507.0, 796.9999999999999, 885.0, 885.0, 0.07686429834199188, 13.303034105141316, 0.041377259866889116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 208.18750000000003, 84, 776, 99.5, 580.7000000000002, 776.0, 776.0, 0.08246785042393628, 3.050484981831302, 0.04767672602633817], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 516.6153846153846, 87, 1386, 454.0, 1275.1999999999998, 1386.0, 1386.0, 0.0829361965460264, 0.016441453026214217, 0.05627101316133642], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 275.45000000000005, 171, 577, 202.5, 473.9000000000001, 572.05, 577.0, 0.09864559596736804, 0.15288140703145808, 0.2218562573367662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 800.304347826087, 265, 2062, 721.0, 1285.0, 1909.3999999999978, 2062.0, 0.09962532215797111, 0.06119563245836311, 0.045045433749160764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 120.76470588235297, 85, 337, 97.0, 295.4, 337.0, 337.0, 0.07686221317960891, 0.057121234599299194, 0.03858122809992087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 157.29411764705878, 83, 307, 99.0, 300.6, 307.0, 307.0, 0.07678722260615835, 0.08838823337443709, 0.03999922648165463], "isController": false}, {"data": ["login", 23, 0, 0.0, 2889.565217391304, 1341, 5426, 2811.0, 3875.8, 5134.599999999996, 5426.0, 0.09786442798241844, 30.676442649317714, 0.18999045688859198], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 110.5625, 85, 264, 101.5, 166.7000000000001, 264.0, 264.0, 0.0804772299737443, 0.06515197621897854, 0.02860714034222942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d79587c8-c6b0-4fca-b4fd-53d6e9191f04", 3, 0, 0.0, 1018.3333333333333, 393, 2119, 543.0, 2119.0, 2119.0, 2119.0, 0.05885815185403178, 0.026631780949578184, 0.03774432264076908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b887035c-3471-4f79-a8ed-a803d7e04017", 3, 0, 0.0, 565.6666666666667, 185, 1253, 259.0, 1253.0, 1253.0, 1253.0, 0.020041151163722844, 0.027628344784624427, 0.012851910088715494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 817.4117647058823, 180, 1354, 1075.0, 1270.0, 1354.0, 1354.0, 0.07675567314725351, 54.06455240296051, 0.16107315577563866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d82f15d2-0b6e-435f-b30d-44b8a0820783", 3, 0, 0.0, 389.3333333333333, 193, 607, 368.0, 607.0, 607.0, 607.0, 0.033168229258800634, 0.02765098799862905, 0.021269990768176192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7dce22a-02d0-4882-a4a1-e37ab990b2e3", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 310.05, 170, 745, 199.0, 546.1000000000003, 735.6499999999999, 745.0, 0.10065475920865229, 0.15599521764075308, 0.22637491255617792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 636.2000000000002, 82, 1250, 836.0, 1238.3, 1250.0, 1250.0, 0.0766160234751496, 55.0038403781767, 0.12396233173205845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e80600ee-db61-470d-8eba-a13239b4e21c", 1, 0, 0.0, 1386.0, 1386, 1386, 1386.0, 1386.0, 1386.0, 1386.0, 0.7215007215007215, 0.13034925144300144, 0.4974409271284272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9649f1d-cf51-4151-ac1b-42dad95a5b3b", 3, 0, 0.0, 342.0, 175, 567, 284.0, 567.0, 567.0, 567.0, 0.03413318769839915, 0.028455434145703198, 0.021888795496694768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d94f3d1e-2579-4b80-b86d-692f2136b65c", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1213.391304347826, 218, 2326, 1195.0, 2155.8, 2306.6, 2326.0, 0.10170420878547487, 0.03204166224474455, 0.045886078573134176], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9aeba4cc-25b6-4926-bc1d-94e1f207bafa", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.7096354166666666, 1.3259548611111112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 409.875, 176, 1275, 359.0, 1114.0000000000002, 1275.0, 1275.0, 0.08242494178738487, 12.437885481490449, 0.18273947665313522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 110.71428571428571, 89, 233, 102.0, 177.5, 233.0, 233.0, 0.08418419501870092, 0.06535784671862034, 0.029924850573053843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 368.42857142857144, 173, 1222, 371.0, 829.0, 1222.0, 1222.0, 0.12764638304856032, 11.091514407515637, 0.2847468840606138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 123.14285714285715, 88, 283, 95.0, 283.0, 283.0, 283.0, 0.05488216016182397, 0.04078644910463675, 0.027548271799978045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 123.28571428571428, 85, 300, 95.0, 300.0, 300.0, 300.0, 0.05487656692197336, 0.014683768883418654, 0.031296792072687936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 154.0, 85, 310, 102.0, 310.0, 310.0, 310.0, 0.054787229879389825, 0.01476687055342929, 0.03220889881581316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 178.85714285714283, 84, 332, 102.0, 332.0, 332.0, 332.0, 0.05480996601782107, 0.014772998653240835, 0.03227579053588487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 0.10283305054244435, 0.030327716077947448, 0.06356769628258521], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1068.1785714285716, 702, 1570, 982.0, 1470.8000000000002, 1562.05, 1570.0, 0.25151583202335503, 300.9003761509095, 0.49664551987424205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1213.391304347826, 218, 2326, 1195.0, 2155.8, 2306.6, 2326.0, 0.09795654136747332, 0.030860968790194124, 0.044195236437278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 117.28571428571428, 84, 257, 98.0, 257.0, 257.0, 257.0, 0.042441990893161384, 0.011439442857922403, 0.024992695809156553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be4973b4-f0fd-4721-9ddc-a83f1e7219de", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 94.28571428571429, 83, 104, 97.0, 104.0, 104.0, 104.0, 0.04248578243637754, 0.011451246047304884, 0.024976993190136017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 186.2857142857143, 87, 1159, 98.0, 710.0, 1159.0, 1159.0, 0.0804454378817567, 5.190487120469916, 0.04679931305342151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 159.35714285714283, 83, 492, 87.5, 421.0, 492.0, 492.0, 0.08044636238787788, 1.7096984374730648, 0.04687841178769056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 111.85714285714285, 87, 293, 98.0, 203.0, 293.0, 293.0, 0.08043619398911814, 0.059777288696991115, 0.040375198935944066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 95.14285714285714, 88, 102, 95.0, 102.0, 102.0, 102.0, 0.042481914841967276, 0.011367231119823275, 0.02422796705830946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 124.64285714285717, 85, 328, 97.5, 309.0, 328.0, 328.0, 0.08044497563666451, 0.030155643071389168, 0.045396195096304125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 98.57142857142858, 86, 106, 100.0, 106.0, 106.0, 106.0, 0.0424816570273764, 0.031570840818196715, 0.02132380050006979], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 625.076923076923, 83, 1364, 571.0, 1319.6, 1364.0, 1364.0, 0.08515042149458639, 0.016522200925519582, 0.05794603878601699], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 215.85714285714286, 93, 687, 113.0, 687.0, 687.0, 687.0, 0.04280036686028737, 0.033688570009171505, 0.015214192907367776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1529.4347826086957, 791, 3189, 1444.0, 2121.2000000000007, 3005.5999999999976, 3189.0, 0.09783736877031189, 0.05063848188307158, 0.04500136786212588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 220.57142857142858, 181, 363, 199.0, 363.0, 363.0, 363.0, 0.042415502260140334, 0.06573574422543234, 0.09539345869638984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3334a92b-b518-45f2-b479-2f6e69893131", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 1073.0847457627117, 443, 4595, 821.0, 1685.0, 2465.0, 4595.0, 0.26853457496438504, 77.23111891160433, 0.9784959702745879], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 161.44642857142858, 83, 415, 101.0, 365.3000000000002, 400.75, 415.0, 0.2523750292935302, 0.1875560520433364, 0.12199769482450923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b20e5978-991f-4aff-8553-eea3230bfae1", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 580.0178571428571, 410, 820, 564.5, 777.0, 797.65, 820.0, 0.2523920911135449, 74.21165499353245, 0.12693547551120665], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 159.99999999999997, 83, 403, 100.0, 293.90000000000003, 393.6, 403.0, 0.25276233119087166, 0.44727084386509713, 0.12292543059868564], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 905.1964285714286, 600, 1378, 870.5, 1183.6000000000001, 1290.2, 1378.0, 0.25201386076234195, 226.76251490706989, 0.1264991449529724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 102.14285714285714, 88, 126, 103.0, 120.0, 126.0, 126.0, 0.1284297626801457, 0.09594606293975727, 0.045652767202708035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, 4.022988505747127, 186.72413793103462, 85, 3288, 104.0, 307.0, 373.5, 2613.75, 0.722249433407772, 1.5099478574304523, 0.3479465506882124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 138.42857142857142, 84, 338, 106.0, 338.0, 338.0, 338.0, 0.05569700827498408, 0.043132546447326545, 0.01979854591024825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b8aca2b-ddc4-4413-be92-a9023bd962bf", 3, 0, 0.0, 576.0, 197, 1140, 391.0, 1140.0, 1140.0, 1140.0, 0.024395995803888723, 0.024467468447845427, 0.015644567621634367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a8b6467-28fa-4563-8be4-ba530605cf14", 3, 0, 0.0, 427.33333333333337, 191, 793, 298.0, 793.0, 793.0, 793.0, 0.021437912233187317, 0.025338886496973682, 0.013747619498495773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 113.05000000000001, 88, 257, 103.5, 121.80000000000001, 250.24999999999991, 257.0, 0.10358400662937643, 0.08406084912989434, 0.03682087735653615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7dce22a-02d0-4882-a4a1-e37ab990b2e3", 3, 0, 0.0, 380.33333333333337, 198, 670, 273.0, 670.0, 670.0, 670.0, 0.08629865086442483, 0.03904789215545264, 0.055341257227512014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d79587c8-c6b0-4fca-b4fd-53d6e9191f04", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 342.85714285714283, 191, 577, 391.0, 577.0, 577.0, 577.0, 0.054749092729320485, 0.08485040054827306, 0.12313199273010263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3a7a764-4a21-4344-b7e8-bb8391512f07", 1, 0, 0.0, 1109.0, 1109, 1109, 1109.0, 1109.0, 1109.0, 1109.0, 0.9017132551848511, 0.1629071798917944, 0.6216890216411182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 348.0, 174, 1249, 205.5, 935.0, 1249.0, 1249.0, 0.08039600776395732, 6.985810777587315, 0.1793432148640733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b887035c-3471-4f79-a8ed-a803d7e04017", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5cd7c1d-c364-46d7-8fcc-f8765847cd1b", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.9795580904907976, 1.8303057898773005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9649f1d-cf51-4151-ac1b-42dad95a5b3b", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 127.05, 88, 298, 103.5, 273.40000000000003, 296.9, 298.0, 0.09902607851777766, 0.08210267642733714, 0.03520067634811627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 101.11764705882354, 85, 156, 101.0, 115.99999999999997, 156.0, 156.0, 0.0770440465346041, 0.05981446972168972, 0.027386750916597556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d82f15d2-0b6e-435f-b30d-44b8a0820783", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e80600ee-db61-470d-8eba-a13239b4e21c", 3, 0, 0.0, 655.0, 215, 1364, 386.0, 1364.0, 1364.0, 1364.0, 0.017138743844334503, 0.02362714198592338, 0.01099066581163378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 95.28571428571429, 83, 112, 97.0, 110.5, 112.0, 112.0, 0.12776287210936502, 0.09494877507346365, 0.06413097291427111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 126.21428571428571, 82, 261, 94.0, 259.0, 261.0, 261.0, 0.12778852824126474, 0.04790287044981562, 0.07211280646427398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 232.2142857142857, 85, 1110, 99.5, 731.0, 1110.0, 1110.0, 0.1277687021437763, 8.243870881170544, 0.07432972767013772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 210.21428571428572, 84, 654, 177.0, 475.0, 654.0, 654.0, 0.12778386272362174, 2.715745795682731, 0.07446333629974443], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.4573170731707317], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.1524390243902439], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.1524390243902439], "isController": false}, {"data": ["401/Unauthorized", 11, 52.38095238095238, 0.8384146341463414], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 21, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

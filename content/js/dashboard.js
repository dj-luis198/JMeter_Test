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

    var data = {"OkPercent": 97.66536964980544, "KoPercent": 2.3346303501945527};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7220372836218375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3072f2a5-a313-432c-a87c-c3db9220ceac"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3d09b2d-30b4-41cb-87f1-4915b84f3dca"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8d40a4b6-aed2-4289-91f3-3b60e564429e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18197b7e-588d-443d-aa49-7ef598503870"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1754099-02d3-4e8b-b309-52be93a2641b"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/950ad9ef-edcd-471f-924f-d3f32f07499b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d40a4b6-aed2-4289-91f3-3b60e564429e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0f12ec73-d185-4b4a-9a25-27d75fd16d5f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3072f2a5-a313-432c-a87c-c3db9220ceac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12d9a1c2-a7e2-490a-8c7f-8b80466b7ac7"], "isController": false}, {"data": [0.5217391304347826, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae70691c-efd2-465e-a312-a86e3d0134fb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45f2e18a-bf4c-4e81-bec5-a77753218152"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6dee7994-2574-46ff-bb48-773be55de115"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9396c349-25b7-4292-b9a5-fd9ccf6edf4c"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18197b7e-588d-443d-aa49-7ef598503870"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae70691c-efd2-465e-a312-a86e3d0134fb"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8b835b4-6d02-4286-8e5f-97ba86aed571"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.275, 500, 1500, "addBook"], "isController": true}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9903846153846154, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8953488372093024, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12d9a1c2-a7e2-490a-8c7f-8b80466b7ac7"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1754099-02d3-4e8b-b309-52be93a2641b"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3d09b2d-30b4-41cb-87f1-4915b84f3dca"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f12ec73-d185-4b4a-9a25-27d75fd16d5f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8b835b4-6d02-4286-8e5f-97ba86aed571"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6dee7994-2574-46ff-bb48-773be55de115"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69ff6493-8437-4c4b-ba7a-a6badc867442"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9396c349-25b7-4292-b9a5-fd9ccf6edf4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=950ad9ef-edcd-471f-924f-d3f32f07499b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45f2e18a-bf4c-4e81-bec5-a77753218152"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 30, 2.3346303501945527, 481.6684824902725, 136, 5288, 158.0, 1364.8000000000002, 1645.0, 2241.380000000002, 5.052252478945672, 699.3928780871327, 3.6954118372113136], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2322.8076923076924, 1661, 3400, 2238.0, 2824.9, 2965.05, 3400.0, 0.23544859749609473, 283.32336084478504, 1.1576989144461298], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 683.5333333333334, 152, 1163, 565.0, 1130.6, 1163.0, 1163.0, 0.0824696923880474, 0.016155683879924127, 0.055527445226379306], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 683.5333333333334, 152, 1163, 565.0, 1130.6, 1163.0, 1163.0, 0.0835868802032833, 0.01637453922732288, 0.056279655928538785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 162.46666666666664, 138, 428, 142.0, 264.2000000000001, 428.0, 428.0, 0.103561836772737, 0.058819886979515464, 0.0573230948074095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 142.60000000000002, 139, 154, 141.0, 149.8, 154.0, 154.0, 0.1035718477908125, 0.07697087516485186, 0.051988212660622674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 390.1333333333334, 137, 1122, 147.0, 1110.6, 1122.0, 1122.0, 0.10356827220503756, 6.112834072408032, 0.05920787748909081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 444.46666666666664, 138, 1659, 141.0, 1578.0, 1659.0, 1659.0, 0.10356326679968793, 18.659612731636507, 0.059103879997790654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3072f2a5-a313-432c-a87c-c3db9220ceac", 3, 0, 0.0, 467.0, 269, 742, 390.0, 742.0, 742.0, 742.0, 0.019763106233283707, 0.027232170796057917, 0.012673606536318001], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 268.79999999999995, 139, 432, 251.0, 406.8, 432.0, 432.0, 0.08338753523123363, 0.1611887570670936, 0.05389788084477132], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3d09b2d-30b4-41cb-87f1-4915b84f3dca", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d40a4b6-aed2-4289-91f3-3b60e564429e", 3, 0, 0.0, 635.3333333333334, 240, 1010, 656.0, 1010.0, 1010.0, 1010.0, 0.03722269095240459, 0.031031025888381556, 0.02387001991413966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 183.71428571428575, 138, 433, 142.0, 430.5, 433.0, 433.0, 0.0857029169599951, 0.06369132793609011, 0.04301884698968504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 1076.375, 820, 1284, 1104.5, 1284.0, 1284.0, 1284.0, 0.042518814575449634, 12.501943242697395, 0.024249011437561124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 180.92857142857144, 137, 433, 140.5, 423.0, 433.0, 433.0, 0.08571288632022335, 0.041325855904393395, 0.04785476716706666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1378.75, 1090, 1646, 1411.0, 1646.0, 1646.0, 1646.0, 0.042488780306450334, 38.23147920705314, 0.024190389569004433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 322.5, 140, 436, 425.5, 436.0, 436.0, 436.0, 0.04267167347635456, 0.07550885970620552, 0.023627772325286164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 168.50000000000003, 139, 497, 144.5, 322.5, 497.0, 497.0, 0.06953861131393206, 0.05167859688467021, 0.03490512325718855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 159.1428571428571, 137, 414, 138.5, 279.5, 414.0, 414.0, 0.06953757512541599, 0.01860673396910545, 0.0396581483137138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 229.14285714285717, 138, 559, 141.5, 487.5, 559.0, 559.0, 0.06953930212343226, 0.018743015025456354, 0.04088150378740842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 180.0, 138, 414, 141.0, 414.0, 414.0, 414.0, 0.06953895671696651, 0.01874292192761988, 0.040949209863604306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 245.5, 139, 422, 146.0, 422.0, 422.0, 422.0, 0.04273778233647456, 0.03176118394341518, 0.023998266448703977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18197b7e-588d-443d-aa49-7ef598503870", 2, 0, 0.0, 384.5, 287, 482, 384.5, 482.0, 482.0, 482.0, 0.016281739215382986, 0.027825237916914283, 0.010120436533780539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 23, 0, 0.0, 753.4347826086954, 136, 1979, 427.0, 1777.0000000000002, 1954.1999999999996, 1979.0, 0.10671764367442767, 37.59240011605544, 0.059149631476137006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 303.78571428571433, 138, 1282, 141.5, 1278.0, 1282.0, 1282.0, 0.08571183680466272, 11.037467647608027, 0.049336919455362505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 23, 0, 0.0, 538.6521739130434, 137, 1282, 417.0, 1110.4, 1247.9999999999995, 1282.0, 0.10671417767446607, 12.295664461047005, 0.05925192346505575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 280.7857142857143, 138, 1131, 140.0, 1118.5, 1131.0, 1131.0, 0.0857123615592303, 3.620127596625382, 0.049420924989439015], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 641.9999999999999, 149, 1201, 527.0, 1181.2, 1201.0, 1201.0, 0.08336899673749326, 0.016331856196817526, 0.056686575646248676], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 400.0, 278, 912, 290.0, 809.0, 912.0, 912.0, 0.06948890907376247, 0.10769423701177837, 0.15628218515319822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1754099-02d3-4e8b-b309-52be93a2641b", 3, 0, 0.0, 388.0, 295, 524, 345.0, 524.0, 524.0, 524.0, 0.08772699359592948, 0.04072223075123549, 0.05625721920051466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 660.7727272727274, 182, 2239, 511.5, 1483.6999999999998, 2145.549999999999, 2239.0, 0.09663193773389321, 0.05935692269005745, 0.04369197965897711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 23, 0, 0.0, 165.82608695652178, 138, 414, 141.0, 310.80000000000035, 413.6, 414.0, 0.10671467280353365, 0.07930650976903234, 0.05356576349708623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/950ad9ef-edcd-471f-924f-d3f32f07499b", 3, 0, 0.0, 765.3333333333333, 244, 1769, 283.0, 1769.0, 1769.0, 1769.0, 0.09632674030310814, 0.043585341478294376, 0.06177203072823016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 23, 0, 0.0, 189.73913043478262, 136, 436, 141.0, 418.2, 432.99999999999994, 436.0, 0.10671318743011446, 0.09127167321638187, 0.05735290109079436], "isController": false}, {"data": ["login", 22, 0, 0.0, 3363.318181818182, 2242, 6256, 3190.0, 4732.7, 6040.599999999997, 6256.0, 0.09824235495855958, 42.87007155504251, 0.2074654560901329], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d40a4b6-aed2-4289-91f3-3b60e564429e", 1, 0, 0.0, 935.0, 935, 935, 935.0, 935.0, 935.0, 935.0, 1.0695187165775402, 0.19322359625668448, 0.7373830213903743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 166.92857142857142, 142, 414, 147.5, 286.0, 414.0, 414.0, 0.08588114050154587, 0.06952682175369289, 0.03052806166265888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f12ec73-d185-4b4a-9a25-27d75fd16d5f", 3, 0, 0.0, 1042.3333333333335, 290, 2544, 293.0, 2544.0, 2544.0, 2544.0, 0.021953736159998828, 0.022160981716196734, 0.014078405024478415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3072f2a5-a313-432c-a87c-c3db9220ceac", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12d9a1c2-a7e2-490a-8c7f-8b80466b7ac7", 3, 0, 0.0, 392.0, 270, 519, 387.0, 519.0, 519.0, 519.0, 0.053201865612087465, 0.034203673367146074, 0.0341170817890014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 0, 0.0, 946.6521739130433, 277, 2121, 646.0, 1917.0000000000002, 2095.7999999999997, 2121.0, 0.10664292702378138, 50.0240000921534, 0.22916547128059608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae70691c-efd2-465e-a312-a86e3d0134fb", 3, 0, 0.0, 349.6666666666667, 227, 576, 246.0, 576.0, 576.0, 576.0, 0.026763491029769923, 0.026841899694896202, 0.017162785588752196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45f2e18a-bf4c-4e81-bec5-a77753218152", 3, 0, 0.0, 504.3333333333333, 432, 610, 471.0, 610.0, 610.0, 610.0, 0.04701825875715069, 0.030228209975707233, 0.03015168286184468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 1131.4166666666665, 139, 1922, 1556.5, 1880.9, 1922.0, 1922.0, 0.06368615462998345, 50.799534892051966, 0.10980264257737868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 662.8666666666666, 282, 1800, 555.0, 1719.6000000000001, 1800.0, 1800.0, 0.10346040570273757, 24.883197512811847, 0.22739061433064567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6dee7994-2574-46ff-bb48-773be55de115", 3, 0, 0.0, 339.6666666666667, 251, 467, 301.0, 467.0, 467.0, 467.0, 0.023241580737377886, 0.02330967130594442, 0.014904268897341937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9396c349-25b7-4292-b9a5-fd9ccf6edf4c", 3, 0, 0.0, 364.6666666666667, 240, 578, 276.0, 578.0, 578.0, 578.0, 0.018189424668497736, 0.02507559032261976, 0.011664442251608247], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1142.7500000000005, 304, 2419, 1210.0, 2149.0, 2394.75, 2419.0, 0.09434778164778401, 0.029207272248386262, 0.0425670655481213], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18197b7e-588d-443d-aa49-7ef598503870", 1, 0, 0.0, 946.0, 946, 946, 946.0, 946.0, 946.0, 946.0, 1.0570824524312896, 0.1909768102536998, 0.7288088002114165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 150.71428571428572, 140, 187, 148.0, 172.5, 187.0, 187.0, 0.08373005430492093, 0.06500526676993373, 0.029763417741202364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 489.42857142857133, 278, 1715, 286.5, 1709.0, 1715.0, 1715.0, 0.0856295299550445, 14.748420249854735, 0.18945294580874034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 431.1764705882353, 277, 844, 294.0, 627.1999999999998, 844.0, 844.0, 0.2458672606048335, 0.381046232988155, 0.5529612316141909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 197.6, 138, 427, 141.0, 427.0, 427.0, 427.0, 0.031994061902110967, 0.023776837019049264, 0.016059519353208044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 193.8, 137, 414, 139.0, 414.0, 414.0, 414.0, 0.03199467608589931, 0.008561075437047275, 0.018246963705239448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 195.2, 138, 415, 141.0, 415.0, 415.0, 415.0, 0.031994471355349795, 0.008623509857496625, 0.01880924976164119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 198.4, 143, 416, 145.0, 416.0, 416.0, 416.0, 0.031937861696283716, 0.00860825178532647, 0.01880715879185457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 164.5, 149, 180, 164.5, 180.0, 180.0, 180.0, 0.021727086071851472, 0.0064077929625968215, 0.013430903792462874], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1602.6346153846152, 1096, 2814, 1508.5, 2242.2000000000003, 2373.6, 2814.0, 0.23497833228647472, 281.11577710045776, 0.4639904178547382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1142.7500000000005, 304, 2419, 1210.0, 2149.0, 2394.75, 2419.0, 0.09642697866151319, 0.02985092991767547, 0.04350514076329989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 140.9, 136, 145, 139.5, 145.0, 145.0, 145.0, 0.052485999359670805, 0.014146617014911274, 0.030907282826056152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 195.0, 137, 416, 140.5, 415.6, 416.0, 416.0, 0.05248379562809983, 0.014146023040386282, 0.030854731414175874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 202.2857142857143, 136, 428, 141.5, 427.5, 428.0, 428.0, 0.08364650984937654, 0.022545348357839768, 0.049174998954418625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 219.92857142857144, 137, 421, 142.5, 420.5, 421.0, 421.0, 0.08351079377009478, 0.02250876863334586, 0.049176766253288234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 168.2, 138, 427, 139.5, 398.5000000000001, 427.0, 427.0, 0.05248544840942849, 0.014043957875179107, 0.029933107296002185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 143.2857142857143, 138, 159, 141.0, 156.5, 159.0, 159.0, 0.08364800917738158, 0.06216419432030018, 0.04198737960661536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 142.79999999999998, 139, 153, 142.0, 152.4, 153.0, 153.0, 0.052484897470752793, 0.039004889624260616, 0.02634495830074896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 221.35714285714286, 138, 431, 143.5, 424.0, 431.0, 431.0, 0.08351079377009478, 0.022345661614263643, 0.04762724957200718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 173.40000000000003, 142, 416, 147.0, 389.5000000000001, 416.0, 416.0, 0.05020281939033696, 0.039515109793566004, 0.01784553345515884], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 748.7142857142857, 139, 2544, 550.0, 2156.5, 2544.0, 2544.0, 0.07757221141752134, 0.014977670284856241, 0.05278979454445719], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae70691c-efd2-465e-a312-a86e3d0134fb", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1859.772727272727, 1017, 5288, 1613.0, 2726.5, 4917.949999999995, 5288.0, 0.09810785620955839, 0.050778480264712836, 0.04512578151826367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8b835b4-6d02-4286-8e5f-97ba86aed571", 1, 0, 0.0, 1022.0, 1022, 1022, 1022.0, 1022.0, 1022.0, 1022.0, 0.9784735812133072, 0.17677501223091976, 0.674611668297456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 342.0, 280, 572, 286.5, 570.8, 572.0, 572.0, 0.05244498521051417, 0.08127948391512305, 0.11795000091778725], "isController": false}, {"data": ["addBook", 60, 12, 20.0, 1367.9500000000003, 718, 3009, 1128.0, 2462.2999999999997, 2644.8, 3009.0, 0.2792750020945625, 79.0573439580017, 1.0164628250062837], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 262.2307692307692, 138, 841, 144.0, 565.5, 583.0499999999998, 841.0, 0.23630348638528373, 0.1756122589250009, 0.11422873609444868], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 918.6538461538462, 682, 1387, 835.5, 1146.6, 1248.0499999999997, 1387.0, 0.2363174470444413, 69.48517590879965, 0.11885105979285866], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 220.3846153846154, 137, 582, 143.5, 417.7, 428.4, 582.0, 0.23707378009583252, 0.4195094624352036, 0.11529564696066855], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1336.0961538461538, 953, 1940, 1254.0, 1711.0, 1825.6, 1940.0, 0.2359100456848877, 212.27227379288914, 0.11841578465042214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 163.76470588235296, 141, 415, 149.0, 209.3999999999998, 415.0, 415.0, 0.24313153415998054, 0.18163635120350108, 0.08642566253343058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 12, 6.976744186046512, 221.59302325581402, 139, 692, 151.0, 426.1, 538.05, 670.1000000000004, 0.7089801403121161, 1.4802407853191648, 0.34320293629071486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 162.0, 141, 213, 150.0, 213.0, 213.0, 213.0, 0.03362113020791307, 0.026036676030151428, 0.011951261128594098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 152.6, 142, 189, 148.0, 175.20000000000002, 189.0, 189.0, 0.098163042269006, 0.07966160949760155, 0.03489389393156073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12d9a1c2-a7e2-490a-8c7f-8b80466b7ac7", 1, 0, 0.0, 1168.0, 1168, 1168, 1168.0, 1168.0, 1168.0, 1168.0, 0.8561643835616438, 0.1546781357020548, 0.590285209760274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 451.0, 284, 842, 289.0, 842.0, 842.0, 842.0, 0.0319089191810895, 0.049452592519911166, 0.07176390710356359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1754099-02d3-4e8b-b309-52be93a2641b", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 408.2857142857143, 278, 572, 305.5, 571.0, 572.0, 572.0, 0.08344061412291995, 0.12931665489558003, 0.18765989680184048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3d09b2d-30b4-41cb-87f1-4915b84f3dca", 3, 0, 0.0, 367.6666666666667, 324, 441, 338.0, 441.0, 441.0, 441.0, 0.025973801092631234, 0.0260498962130198, 0.016656376351719897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f12ec73-d185-4b4a-9a25-27d75fd16d5f", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 903.0, 1.1074197120708749, 0.20007094407530454, 0.7635139811738648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8b835b4-6d02-4286-8e5f-97ba86aed571", 3, 0, 0.0, 542.3333333333334, 237, 912, 478.0, 912.0, 912.0, 912.0, 0.040230655759688885, 0.025864435262169777, 0.025798955679227575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 151.28571428571428, 140, 185, 148.0, 173.5, 185.0, 185.0, 0.07123195669097034, 0.05905852659241583, 0.025320734604993362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6dee7994-2574-46ff-bb48-773be55de115", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 188.7391304347826, 140, 498, 150.0, 426.0, 485.1999999999998, 498.0, 0.10157619760545156, 0.07886042685188865, 0.036107163992562856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69ff6493-8437-4c4b-ba7a-a6badc867442", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9396c349-25b7-4292-b9a5-fd9ccf6edf4c", 1, 0, 0.0, 1201.0, 1201, 1201, 1201.0, 1201.0, 1201.0, 1201.0, 0.8326394671107411, 0.15042802872606162, 0.5740658825978351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=950ad9ef-edcd-471f-924f-d3f32f07499b", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 0.6666570571955719, 2.5441074723247232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45f2e18a-bf4c-4e81-bec5-a77753218152", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.28495908911671924, 1.0874654968454258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 156.76470588235293, 137, 415, 140.0, 199.7999999999998, 415.0, 415.0, 0.2463803823243815, 0.18310104584849057, 0.12367140284641807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 256.0000000000001, 137, 429, 146.0, 427.4, 429.0, 429.0, 0.2463661000246366, 0.06592217910815472, 0.14050566642030057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 189.5294117647059, 137, 430, 140.0, 418.0, 430.0, 430.0, 0.2463803823243815, 0.06640721242336846, 0.1448447169524196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 205.47058823529412, 137, 426, 139.0, 418.8, 426.0, 426.0, 0.24637324096752222, 0.06640528760452746, 0.14508111748380456], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 33.333333333333336, 0.7782101167315175], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.666666666666667, 0.1556420233463035], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.666666666666667, 0.1556420233463035], "isController": false}, {"data": ["401/Unauthorized", 16, 53.333333333333336, 1.245136186770428], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 30, "401/Unauthorized", 16, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

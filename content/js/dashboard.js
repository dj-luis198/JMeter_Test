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

    var data = {"OkPercent": 98.62490450725745, "KoPercent": 1.3750954927425516};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.819016393442623, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f8da8f1-ca1d-478d-ae47-6cd20b1400df"], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a81c3deb-7727-4e7a-9590-926cdfd4a8e8"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/69e35093-7a09-444b-8eb4-5b078c9a32c9"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/23c0011e-e5f0-418d-9904-944411493eba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20258bc6-4ee8-485e-92da-8b8e6f691bf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/734dd18f-5368-4e4b-a1b2-bfb10cdac6c1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa6ed22e-9cb6-4de5-8222-d47fd1cb1cef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e4dd884-3200-4721-b1f4-be4c1d1821c7"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4605d40e-fc19-49a4-8fd1-1e12785ad9a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b263f257-070d-416f-be4c-18e2fc19bc6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11e786c2-12ff-4361-95de-cde7dd031802"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/962b7820-ef38-4b52-9df8-5548540474b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73d1f3a3-85b1-4cbe-a9d7-79b9c49fb393"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdcda034-3286-4bf5-b1bb-dca84e0abb9a"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0d515f6-b100-49e8-bb4f-5a2971ca858f"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23c0011e-e5f0-418d-9904-944411493eba"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f8da8f1-ca1d-478d-ae47-6cd20b1400df"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa6ed22e-9cb6-4de5-8222-d47fd1cb1cef"], "isController": false}, {"data": [0.8660714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9396551724137931, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69e35093-7a09-444b-8eb4-5b078c9a32c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=734dd18f-5368-4e4b-a1b2-bfb10cdac6c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a81c3deb-7727-4e7a-9590-926cdfd4a8e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20258bc6-4ee8-485e-92da-8b8e6f691bf9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4605d40e-fc19-49a4-8fd1-1e12785ad9a4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdcda034-3286-4bf5-b1bb-dca84e0abb9a"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b263f257-070d-416f-be4c-18e2fc19bc6e"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef0bc0a3-01d6-492d-9e26-3b1411727fd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/444c8642-fb12-4866-aa9c-a16b919e4a01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0d515f6-b100-49e8-bb4f-5a2971ca858f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e4dd884-3200-4721-b1f4-be4c1d1821c7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/73d1f3a3-85b1-4cbe-a9d7-79b9c49fb393"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 18, 1.3750954927425516, 308.6226126814362, 77, 3198, 108.0, 796.0, 1013.5, 1637.8000000000038, 5.1482126774245565, 737.3498778516241, 3.7557844879121225], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f8da8f1-ca1d-478d-ae47-6cd20b1400df", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1312.0535714285716, 948, 1746, 1326.5, 1593.3, 1691.9499999999998, 1746.0, 0.24802685776545516, 298.4607949053179, 1.2195461219229167], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a81c3deb-7727-4e7a-9590-926cdfd4a8e8", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69e35093-7a09-444b-8eb4-5b078c9a32c9", 3, 0, 0.0, 1210.0, 609, 2357, 664.0, 2357.0, 2357.0, 2357.0, 0.018027762754642147, 0.02485272632353825, 0.01156077233940268], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 466.8571428571429, 83, 962, 455.5, 732.0, 962.0, 962.0, 0.07120369852354044, 0.013445062214231585, 0.04815289182378102], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 466.8571428571429, 83, 962, 455.5, 732.0, 962.0, 962.0, 0.07141545430431145, 0.013485047070436042, 0.0482960958063825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 118.5, 77, 239, 80.0, 238.3, 239.0, 239.0, 0.09087191603434959, 0.04137600669044482, 0.05087141197919033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 80.375, 78, 89, 79.5, 84.80000000000001, 89.0, 89.0, 0.09086727131263453, 0.0675292904969872, 0.045611110795599756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 146.875, 77, 612, 80.0, 509.10000000000014, 612.0, 612.0, 0.09087294825921508, 3.3613894686772308, 0.052535923212358726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 215.37499999999997, 77, 932, 81.0, 866.9000000000001, 932.0, 932.0, 0.09087243214385106, 10.242328112664778, 0.05244688222364841], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 270.2857142857142, 78, 609, 232.5, 529.0, 609.0, 609.0, 0.0712486322807196, 0.14612529898979618, 0.04605615759943001], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/23c0011e-e5f0-418d-9904-944411493eba", 3, 0, 0.0, 318.66666666666663, 176, 591, 189.0, 591.0, 591.0, 591.0, 0.06242327139557627, 0.04013214876505962, 0.04003054838843921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20258bc6-4ee8-485e-92da-8b8e6f691bf9", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.22331775339925833, 0.8522288318912237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 89.58823529411764, 78, 234, 81.0, 115.5999999999999, 234.0, 234.0, 0.10970431460616151, 0.08152830411649307, 0.05506642354254592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 106.94117647058823, 78, 236, 80.0, 235.2, 236.0, 236.0, 0.10970714645258715, 0.03904787910272461, 0.06202537542430852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 477.0, 382, 609, 463.0, 609.0, 609.0, 609.0, 0.05181078700585462, 15.234091659758562, 0.029548339464276464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 867.0, 711, 933, 906.0, 933.0, 933.0, 933.0, 0.05155968032998195, 46.39349099316834, 0.029354778937870588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 204.8, 79, 244, 233.0, 244.0, 244.0, 244.0, 0.05193456245131135, 0.09189983121267203, 0.028756735263567902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 99.29411764705883, 78, 240, 80.0, 235.2, 240.0, 240.0, 0.08668471748430752, 0.06442096680230275, 0.043511664830990296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 134.58823529411765, 77, 236, 81.0, 236.0, 236.0, 236.0, 0.08668206548065205, 0.030852600971858924, 0.04900763375807545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 155.11764705882354, 78, 736, 81.0, 336.7999999999996, 736.0, 736.0, 0.08668560152158726, 4.610216957807059, 0.05052344399345269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 106.94117647058822, 78, 540, 79.0, 173.59999999999968, 540.0, 540.0, 0.08668648557689856, 1.5213259112279396, 0.05060861402332376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 111.4, 79, 233, 82.0, 233.0, 233.0, 233.0, 0.052015604681404426, 0.03865612808842653, 0.029207981144343302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 532.1111111111112, 78, 1087, 716.0, 1019.5000000000001, 1087.0, 1087.0, 0.09046226215963575, 45.232004684563115, 0.04886297103197338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 134.23529411764707, 78, 840, 80.0, 357.59999999999957, 840.0, 840.0, 0.10970643847727464, 5.834538541243168, 0.06394080450312663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 371.16666666666674, 78, 713, 462.5, 635.6000000000001, 713.0, 713.0, 0.09046044365822035, 14.787710854499402, 0.04895032904986381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 121.29411764705881, 78, 625, 80.0, 311.39999999999975, 625.0, 625.0, 0.10970643847727464, 1.9253202661671798, 0.06404793969695209], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 689.6428571428572, 82, 3198, 448.0, 2194.0, 3198.0, 3198.0, 0.0714482561522052, 0.01349124089034734, 0.048896403537199026], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/734dd18f-5368-4e4b-a1b2-bfb10cdac6c1", 3, 0, 0.0, 308.3333333333333, 198, 413, 314.0, 413.0, 413.0, 413.0, 0.028090676704401806, 0.02835585561860352, 0.018013877964736837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 265.1764705882353, 159, 971, 163.0, 576.5999999999997, 971.0, 971.0, 0.08664495446043129, 6.223883076456527, 0.19356247897585663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa6ed22e-9cb6-4de5-8222-d47fd1cb1cef", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.0883377259036144, 4.153332078313253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e4dd884-3200-4721-b1f4-be4c1d1821c7", 3, 0, 0.0, 303.0, 196, 429, 284.0, 429.0, 429.0, 429.0, 0.050865562318791434, 0.03223803705556215, 0.032618866460943724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 590.1818181818182, 151, 1509, 560.0, 1047.6, 1441.049999999999, 1509.0, 0.09846352150309041, 0.06048198732953503, 0.04452012739836998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 97.94444444444446, 78, 239, 81.0, 235.4, 239.0, 239.0, 0.09053005346302602, 0.0672786823099246, 0.04544184324218298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 149.6111111111111, 78, 241, 82.5, 240.1, 241.0, 241.0, 0.0905318747642399, 0.099765811643405, 0.04740742487111782], "isController": false}, {"data": ["login", 22, 0, 0.0, 2699.454545454546, 1520, 4810, 2338.0, 4050.8, 4698.0999999999985, 4810.0, 0.09815031274258741, 26.82210426602527, 0.1850774718263989], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 86.47058823529413, 80, 112, 84.0, 103.19999999999999, 112.0, 112.0, 0.11091320715324943, 0.08979203977543337, 0.039426179105256635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4605d40e-fc19-49a4-8fd1-1e12785ad9a4", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b263f257-070d-416f-be4c-18e2fc19bc6e", 3, 0, 0.0, 307.3333333333333, 186, 493, 243.0, 493.0, 493.0, 493.0, 0.03223068576155738, 0.02686939656098583, 0.020668766585373716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11e786c2-12ff-4361-95de-cde7dd031802", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.8674616228070173, 3.4893548976608186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 632.5, 161, 1166, 806.0, 1100.3000000000002, 1166.0, 1166.0, 0.09042318048466826, 60.160928143712574, 0.19051073084535627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/962b7820-ef38-4b52-9df8-5548540474b1", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73d1f3a3-85b1-4cbe-a9d7-79b9c49fb393", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdcda034-3286-4bf5-b1bb-dca84e0abb9a", 1, 0, 0.0, 1190.0, 1190, 1190, 1190.0, 1190.0, 1190.0, 1190.0, 0.8403361344537815, 0.1518185399159664, 0.5793723739495799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 326.18750000000006, 159, 1013, 242.5, 947.9000000000001, 1013.0, 1013.0, 0.09082549017381727, 13.705524336264347, 0.2013638369795983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 721.7142857142857, 78, 1139, 942.0, 1139.0, 1139.0, 1139.0, 0.07212108099197397, 61.635432443153135, 0.1298139211716585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0d515f6-b100-49e8-bb4f-5a2971ca858f", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.2775177611367127, 1.0590677803379416], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1161.9565217391305, 351, 2042, 1055.0, 1783.6000000000001, 1997.5999999999995, 2042.0, 0.1025576998537438, 0.032310552518460385, 0.04627114973870081], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 242.82352941176464, 158, 921, 163.0, 561.7999999999997, 921.0, 921.0, 0.10964841558039486, 7.876268414483911, 0.24495158740268705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 95.10526315789474, 79, 239, 88.0, 98.0, 239.0, 239.0, 0.12218256647696216, 0.0948585354972509, 0.043432084177357645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 279.5, 158, 781, 167.5, 626.0, 781.0, 781.0, 0.06435627634585063, 5.592078281078336, 0.14356261980610374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 83.28571428571429, 79, 90, 82.0, 90.0, 90.0, 90.0, 0.03153849273037742, 0.023438274382634006, 0.01583084498380273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 101.57142857142857, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.031539061127206044, 0.015206333043474343, 0.01760872246527324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 222.14285714285714, 78, 926, 79.0, 926.0, 926.0, 926.0, 0.031539203229614406, 4.061433615890802, 0.018154401859010752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 159.14285714285714, 77, 636, 80.0, 636.0, 636.0, 636.0, 0.031539061127206044, 1.332076534600603, 0.018185119927279936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 3.596608231707317, 7.53858612804878], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 879.7142857142856, 617, 1402, 792.0, 1258.9, 1338.25, 1402.0, 0.2554989300982302, 305.6655461974003, 0.504510582674435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23c0011e-e5f0-418d-9904-944411493eba", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1161.9565217391305, 351, 2042, 1055.0, 1783.6000000000001, 1997.5999999999995, 2042.0, 0.09913066714938991, 0.03123087424628368, 0.04472496896779116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 157.57142857142856, 78, 317, 80.0, 317.0, 317.0, 317.0, 0.03927619581989059, 0.010586162154579885, 0.023128462968158226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 146.14285714285714, 78, 236, 81.0, 236.0, 236.0, 236.0, 0.03924184750618059, 0.010576904210650237, 0.023069914256563198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f8da8f1-ca1d-478d-ae47-6cd20b1400df", 3, 0, 0.0, 308.0, 215, 480, 229.0, 480.0, 480.0, 480.0, 0.03061911857763988, 0.025525899309028557, 0.019635307160791197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 164.68421052631578, 77, 771, 80.0, 236.0, 771.0, 771.0, 0.12252847174751397, 5.833988884168677, 0.07147914033379335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 156.89473684210526, 77, 618, 80.0, 236.0, 618.0, 618.0, 0.12252847174751397, 1.927468082139218, 0.07159879704448428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 123.28571428571428, 78, 233, 80.0, 233.0, 233.0, 233.0, 0.039242067496356094, 0.010500318841798409, 0.022380241619015584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 107.05263157894738, 79, 245, 80.0, 239.0, 245.0, 245.0, 0.1225300521075169, 0.09105993130255895, 0.061504342561780945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 149.71428571428572, 80, 238, 99.0, 238.0, 238.0, 238.0, 0.0392755347083511, 0.029188165930717956, 0.019714477382902797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 129.0526315789474, 77, 236, 81.0, 236.0, 236.0, 236.0, 0.12252610128394456, 0.04247101290393309, 0.0693365735575776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 104.28571428571429, 81, 239, 82.0, 239.0, 239.0, 239.0, 0.038662712023551114, 0.030431783096662304, 0.013743385914621686], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 547.7857142857143, 79, 999, 471.0, 971.5, 999.0, 999.0, 0.07123630609223065, 0.01331208593897084, 0.04848302445186207], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1465.2272727272727, 727, 2795, 1344.5, 2559.7, 2771.45, 2795.0, 0.09916208042044722, 0.05132412365511428, 0.0456106834746393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 330.7142857142857, 162, 553, 317.0, 553.0, 553.0, 553.0, 0.03922381670150115, 0.060789254985627275, 0.08821528306988004], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 900.457627118644, 410, 2772, 715.0, 1554.0, 1690.0, 2772.0, 0.2817466381418093, 98.23306207260468, 1.0218165614494195], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 139.46428571428572, 78, 325, 82.0, 320.3, 322.0, 325.0, 0.25630815563397363, 0.19047901019282612, 0.12389896195196969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa6ed22e-9cb6-4de5-8222-d47fd1cb1cef", 3, 0, 0.0, 597.6666666666666, 345, 999, 449.0, 999.0, 999.0, 999.0, 0.10379545375912534, 0.04696473981939591, 0.06656153772964744], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 482.4107142857143, 383, 701, 466.5, 622.0, 626.75, 701.0, 0.25619324290321843, 75.32931982981448, 0.12884718759292724], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 130.9285714285714, 77, 333, 84.0, 239.50000000000003, 261.0999999999999, 333.0, 0.2566370464742194, 0.4541272736438336, 0.124809813617345], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 738.7142857142854, 534, 1081, 703.5, 945.0, 1023.35, 1081.0, 0.25592278443989475, 230.27977130328676, 0.12846124140830653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 86.42857142857142, 82, 108, 84.0, 99.5, 108.0, 108.0, 0.06275775506544738, 0.04688445568854222, 0.022308420745920744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, 4.597701149425287, 156.10919540229884, 79, 2076, 88.0, 282.0, 380.0, 1161.0, 0.7172270518258376, 1.5731487542817217, 0.34452870273617997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 85.14285714285714, 82, 89, 85.0, 89.0, 89.0, 89.0, 0.03267958599633055, 0.02530753095223645, 0.011616571584633126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69e35093-7a09-444b-8eb4-5b078c9a32c9", 1, 0, 0.0, 3198.0, 3198, 3198, 3198.0, 3198.0, 3198.0, 3198.0, 0.31269543464665417, 0.056492827548467794, 0.21558884459036898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=734dd18f-5368-4e4b-a1b2-bfb10cdac6c1", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a81c3deb-7727-4e7a-9590-926cdfd4a8e8", 3, 0, 0.0, 336.6666666666667, 195, 462, 353.0, 462.0, 462.0, 462.0, 0.02582800272054962, 0.03098183269050304, 0.016562879348789958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 85.4375, 79, 96, 84.5, 95.3, 96.0, 96.0, 0.08754171910050884, 0.07104215680910433, 0.031118345461509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20258bc6-4ee8-485e-92da-8b8e6f691bf9", 3, 0, 0.0, 283.3333333333333, 210, 420, 220.0, 420.0, 420.0, 420.0, 0.04991680532445923, 0.032091696131447585, 0.032010451331114805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4605d40e-fc19-49a4-8fd1-1e12785ad9a4", 3, 0, 0.0, 901.6666666666666, 236, 2061, 408.0, 2061.0, 2061.0, 2061.0, 0.024362712057106196, 0.024434087190086003, 0.015623223552245836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdcda034-3286-4bf5-b1bb-dca84e0abb9a", 3, 0, 0.0, 500.66666666666663, 241, 944, 317.0, 944.0, 944.0, 944.0, 0.02436765924265315, 0.02443904886934061, 0.015626396063810777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 329.8571428571429, 160, 1017, 167.0, 1017.0, 1017.0, 1017.0, 0.03152698710095842, 5.430057308743784, 0.0697525793016322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b263f257-070d-416f-be4c-18e2fc19bc6e", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 306.3157894736843, 159, 852, 314.0, 482.0, 852.0, 852.0, 0.12246292273878658, 7.890763979303766, 0.27377286310256593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef0bc0a3-01d6-492d-9e26-3b1411727fd3", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 85.94117647058823, 80, 109, 82.0, 97.79999999999998, 109.0, 109.0, 0.08918032786885245, 0.07393954918032787, 0.03170081967213115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 107.61111111111109, 79, 251, 85.5, 242.0, 251.0, 251.0, 0.09192443811187204, 0.0713671174794319, 0.03267626511007952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/444c8642-fb12-4866-aa9c-a16b919e4a01", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 91.35714285714285, 78, 237, 80.0, 160.0, 237.0, 237.0, 0.06438143239489731, 0.04784596684816099, 0.03231646118259494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0d515f6-b100-49e8-bb4f-5a2971ca858f", 3, 0, 0.0, 267.6666666666667, 179, 412, 212.0, 412.0, 412.0, 412.0, 0.030987253909558532, 0.02583279858801413, 0.01987138352924164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 124.57142857142856, 78, 234, 81.5, 234.0, 234.0, 234.0, 0.06438084026193805, 0.024133833396181296, 0.03633098477393128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e4dd884-3200-4721-b1f4-be4c1d1821c7", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73d1f3a3-85b1-4cbe-a9d7-79b9c49fb393", 3, 0, 0.0, 928.0, 267, 1642, 875.0, 1642.0, 1642.0, 1642.0, 0.019543082725869177, 0.023099262167197588, 0.012532510732409597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 164.00000000000003, 77, 700, 84.0, 507.5, 700.0, 700.0, 0.0643805441995429, 4.15395073077666, 0.037453525294655954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 148.42857142857144, 78, 551, 83.5, 394.5, 551.0, 551.0, 0.06438143239489731, 1.3682760922999806, 0.03751691449685911], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.45836516424751717], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07639419404125286], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07639419404125286], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.7639419404125286], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 18, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

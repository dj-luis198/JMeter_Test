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

    var data = {"OkPercent": 98.69130100076983, "KoPercent": 1.308698999230177};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7303630363036303, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0efdeb3f-9161-4dcb-8280-22ed4621a002"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=922a79ed-8e87-43a7-ac8b-b6931f245717"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2980707-c07e-4ef9-8b39-0fdc3cb87266"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=332ad49f-38c5-48ff-9e69-7155486b9224"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdc6a569-c421-45ce-aed3-2dcd90b0b1cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d98bc7ac-24f1-4597-8915-3dd93b72c0ec"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0ef0a256-3c69-4b71-aad4-27ebdc7b189d"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ec967e8e-a6a3-4768-b8fb-b6506f12fb1d"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc5ed44b-1f5c-4600-8980-baf301b0e413"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8975bb4-39a0-4051-aafe-bae1b33e7b91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65ea25e0-c990-4b3d-bd9f-c87cd44de8ee"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25457ed7-c9bc-4f03-9b36-590482fbeb70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25edaef5-8197-4184-b5fe-109c8afed9d6"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2980707-c07e-4ef9-8b39-0fdc3cb87266"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/922a79ed-8e87-43a7-ac8b-b6931f245717"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.21296296296296297, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d98bc7ac-24f1-4597-8915-3dd93b72c0ec"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65ea25e0-c990-4b3d-bd9f-c87cd44de8ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.28688524590163933, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ef0a256-3c69-4b71-aad4-27ebdc7b189d"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59ed12ed-5929-4d77-8405-900f545894e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec967e8e-a6a3-4768-b8fb-b6506f12fb1d"], "isController": false}, {"data": [0.9232954545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0efdeb3f-9161-4dcb-8280-22ed4621a002"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59ed12ed-5929-4d77-8405-900f545894e4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdc6a569-c421-45ce-aed3-2dcd90b0b1cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/332ad49f-38c5-48ff-9e69-7155486b9224"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c8975bb4-39a0-4051-aafe-bae1b33e7b91"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/86910bd3-3cf4-4be4-8c8f-10508b7b2802"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/225469c2-6278-4451-9f23-fa36d977bc27"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc5ed44b-1f5c-4600-8980-baf301b0e413"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25457ed7-c9bc-4f03-9b36-590482fbeb70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 17, 1.308698999230177, 494.44110854503424, 140, 3472, 163.0, 1412.0, 1713.0, 2132.0, 5.099677295247368, 707.8192989256424, 3.72213766994017], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2440.4444444444453, 1720, 3284, 2459.5, 2950.5, 3044.75, 3284.0, 0.2380070873221558, 286.4034801374271, 1.1702789889326706], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0efdeb3f-9161-4dcb-8280-22ed4621a002", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=922a79ed-8e87-43a7-ac8b-b6931f245717", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 569.8571428571428, 152, 1024, 510.5, 940.0, 1024.0, 1024.0, 0.09557096827043854, 0.018046220082873682, 0.0646317339133581], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 569.8571428571428, 152, 1024, 510.5, 940.0, 1024.0, 1024.0, 0.09412081078355575, 0.01777239360986924, 0.06365103658946519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 178.35294117647058, 141, 434, 145.0, 424.4, 434.0, 434.0, 0.09660298446396709, 0.03438373688756549, 0.054616645972792054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 146.58823529411762, 141, 152, 147.0, 151.2, 152.0, 152.0, 0.09660353341629872, 0.07179227434551105, 0.048490445484353065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2980707-c07e-4ef9-8b39-0fdc3cb87266", 3, 0, 0.0, 330.6666666666667, 258, 476, 258.0, 476.0, 476.0, 476.0, 0.030224873055533168, 0.025197233038808737, 0.0193824869529298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 212.64705882352942, 141, 986, 147.0, 539.5999999999996, 986.0, 986.0, 0.09660518031072772, 1.695396496783616, 0.05639926743439372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 316.9411764705882, 143, 1625, 148.0, 682.5999999999992, 1625.0, 1625.0, 0.09660353341629872, 5.1376842303965855, 0.05630396656949488], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 427.57142857142856, 151, 1943, 272.0, 1263.0, 1943.0, 1943.0, 0.09600614439324116, 0.20345052083333331, 0.06205977539705398], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=332ad49f-38c5-48ff-9e69-7155486b9224", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdc6a569-c421-45ce-aed3-2dcd90b0b1cd", 1, 0, 0.0, 858.0, 858, 858, 858.0, 858.0, 858.0, 858.0, 1.1655011655011656, 0.2105641754079254, 0.8035584207459208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 189.47619047619048, 142, 429, 150.0, 426.8, 428.8, 429.0, 0.10725394158235316, 0.07970727494547925, 0.05383645114582961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 217.85714285714286, 142, 454, 148.0, 449.40000000000003, 454.0, 454.0, 0.10710952203650904, 0.03632080704474628, 0.06065754089288537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1008.4, 702, 1206, 1125.0, 1206.0, 1206.0, 1206.0, 0.10379473553101387, 30.519098555696257, 0.05919543510753135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d98bc7ac-24f1-4597-8915-3dd93b72c0ec", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1531.8, 1297, 1772, 1629.0, 1772.0, 1772.0, 1772.0, 0.10275802540178387, 92.46185188586666, 0.058503836727773435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 315.0, 142, 432, 425.0, 432.0, 432.0, 432.0, 0.10541628892496469, 0.18653741751175393, 0.05837015216841307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 195.84615384615384, 142, 463, 151.0, 455.0, 463.0, 463.0, 0.06226381658037541, 0.046272230876626644, 0.03125351730694625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 237.46153846153848, 140, 450, 151.0, 448.0, 450.0, 450.0, 0.06226411479586949, 0.023854190614403126, 0.0351077558336686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 340.69230769230774, 142, 1545, 149.0, 1103.7999999999997, 1545.0, 1545.0, 0.06226322015795701, 4.32507211906883, 0.03619236760684129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 244.76923076923075, 142, 871, 148.0, 691.3999999999999, 871.0, 871.0, 0.0622656059161905, 1.423811220860894, 0.03625456065627949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 201.0, 142, 426, 143.0, 426.0, 426.0, 426.0, 0.10542073414999262, 0.078344901062641, 0.059196213023677495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 1015.5555555555557, 142, 1903, 1435.5, 1843.6000000000001, 1903.0, 1903.0, 0.08838780641106223, 44.194756777012294, 0.04774245880146134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 253.61904761904762, 143, 1721, 147.0, 433.6, 1592.4999999999982, 1721.0, 0.10711006834642456, 4.616915142367133, 0.06253068257166174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 702.2777777777777, 142, 1325, 870.5, 1317.8, 1325.0, 1325.0, 0.08826601415198428, 14.42898401527002, 0.047762870288188534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 234.1904761904762, 141, 1125, 146.0, 442.6, 1056.799999999999, 1125.0, 0.10726435043774071, 1.529404877590945, 0.06272550254625137], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 615.0714285714287, 153, 1607, 538.5, 1387.0, 1607.0, 1607.0, 0.09391561011605286, 0.017733646525122427, 0.06427218546655934], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0ef0a256-3c69-4b71-aad4-27ebdc7b189d", 3, 0, 0.0, 721.3333333333334, 256, 1044, 864.0, 1044.0, 1044.0, 1044.0, 0.024150117128068072, 0.02854462086328619, 0.015486891517673861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 563.0769230769231, 289, 1693, 305.0, 1374.1999999999998, 1693.0, 1693.0, 0.062218521017895, 5.814776958567251, 0.13870635879267354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec967e8e-a6a3-4768-b8fb-b6506f12fb1d", 3, 0, 0.0, 444.3333333333333, 253, 583, 497.0, 583.0, 583.0, 583.0, 0.028670272749861427, 0.028754267689558285, 0.018385559022534834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 677.7619047619047, 181, 1751, 546.0, 1274.0, 1703.7999999999993, 1751.0, 0.09542028089913168, 0.058612653013236156, 0.04314413091435348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 164.77777777777774, 143, 426, 149.5, 191.10000000000036, 426.0, 426.0, 0.0883852023530105, 0.06568470604554784, 0.044365228524850975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 242.6111111111111, 141, 454, 150.5, 446.8, 454.0, 454.0, 0.08826558132692591, 0.0972683641445594, 0.04622067008287157], "isController": false}, {"data": ["login", 21, 0, 0.0, 3002.952380952381, 1579, 5972, 2789.0, 4244.6, 5800.899999999998, 5972.0, 0.09674476887214027, 27.690270290775615, 0.18416327724056278], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 151.80952380952382, 144, 158, 152.0, 157.8, 158.0, 158.0, 0.10995685502450467, 0.08901780548370544, 0.03908622580949189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc5ed44b-1f5c-4600-8980-baf301b0e413", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8975bb4-39a0-4051-aafe-bae1b33e7b91", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65ea25e0-c990-4b3d-bd9f-c87cd44de8ee", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1198.1666666666665, 289, 2057, 1594.0, 1996.7, 2057.0, 2057.0, 0.08820156998794579, 58.68283205441057, 0.18583006558766746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25457ed7-c9bc-4f03-9b36-590482fbeb70", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25edaef5-8197-4184-b5fe-109c8afed9d6", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 466.7647058823529, 287, 1772, 302.0, 832.7999999999992, 1772.0, 1772.0, 0.09652345235999842, 6.933475646281292, 0.2156307754381881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1280.857142857143, 149, 1916, 1732.0, 1916.0, 1916.0, 1916.0, 0.11912663160940079, 101.80686913939518, 0.21442128920542536], "isController": false}, {"data": ["register", 24, 6, 25.0, 1133.916666666667, 196, 2009, 1193.0, 1665.0, 1933.0, 2009.0, 0.098354609347786, 0.031023963690756717, 0.04437483351433314], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2980707-c07e-4ef9-8b39-0fdc3cb87266", 1, 0, 0.0, 1607.0, 1607, 1607, 1607.0, 1607.0, 1607.0, 1607.0, 0.6222775357809583, 0.11242318761667704, 0.429031191661481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 511.23809523809535, 294, 2148, 309.0, 859.2, 2019.2999999999981, 2148.0, 0.10702163875610278, 6.254873306764787, 0.239390245805771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 152.84615384615387, 144, 174, 150.0, 170.0, 174.0, 174.0, 0.08117339261072362, 0.06302035852102078, 0.028854604404593164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 458.75, 287, 1693, 303.5, 926.5000000000008, 1693.0, 1693.0, 0.09540676076158447, 7.272348893952404, 0.21304637141255672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/922a79ed-8e87-43a7-ac8b-b6931f245717", 3, 0, 0.0, 1018.0, 248, 1943, 863.0, 1943.0, 1943.0, 1943.0, 0.018460970431679026, 0.021820242069474787, 0.0118385780437525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 209.00000000000003, 142, 426, 150.0, 426.0, 426.0, 426.0, 0.07078365369490672, 0.052603867638500015, 0.03553007617107623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 208.22222222222226, 141, 426, 148.0, 426.0, 426.0, 426.0, 0.07063421678425956, 0.018900171287975703, 0.04028357675977303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 176.55555555555554, 142, 426, 144.0, 426.0, 426.0, 426.0, 0.07078977795606314, 0.019080057339720145, 0.04161664680620118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 211.1111111111111, 142, 455, 146.0, 455.0, 455.0, 455.0, 0.07063366243387904, 0.01903797932788146, 0.04159384614026276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 153.0, 153, 153, 153.0, 153.0, 153.0, 153.0, 6.5359477124183005, 1.927593954248366, 4.040287990196078], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1712.074074074074, 1131, 2681, 1665.5, 2292.0, 2422.25, 2681.0, 0.24591171769334808, 294.1959071068486, 0.4855795831796385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1133.916666666667, 196, 2009, 1193.0, 1665.0, 1933.0, 2009.0, 0.09513842641042718, 0.030009484111882787, 0.04292378222814194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 179.875, 142, 422, 145.5, 422.0, 422.0, 422.0, 0.0451962080381456, 0.012181790447781431, 0.026614563913087693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 147.99999999999997, 144, 152, 148.5, 152.0, 152.0, 152.0, 0.0451954420396703, 0.012181583987254887, 0.02656997666785305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 415.69230769230774, 142, 1644, 146.0, 1620.8, 1644.0, 1644.0, 0.07814425429342566, 10.835412327406392, 0.0449071172885146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d98bc7ac-24f1-4597-8915-3dd93b72c0ec", 3, 0, 0.0, 451.66666666666663, 236, 855, 264.0, 855.0, 855.0, 855.0, 0.05092946269416858, 0.03274273724641372, 0.03265984424072659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 317.99999999999994, 142, 1120, 147.0, 1011.1999999999999, 1120.0, 1120.0, 0.07814284512088097, 3.552681802334668, 0.04498261885226194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65ea25e0-c990-4b3d-bd9f-c87cd44de8ee", 3, 0, 0.0, 401.3333333333333, 233, 544, 427.0, 544.0, 544.0, 544.0, 0.09557792787052377, 0.04231314515101312, 0.061291835255511656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 216.5, 142, 442, 145.0, 442.0, 442.0, 442.0, 0.0451962080381456, 0.012093516603956928, 0.025775962396754913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 147.6923076923077, 144, 152, 147.0, 151.6, 152.0, 152.0, 0.07814472402890152, 0.05807435057225983, 0.03922498842856971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 148.0, 143, 154, 148.0, 154.0, 154.0, 154.0, 0.04519722940983718, 0.03358895662195907, 0.022686890543609676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 189.3076923076923, 142, 441, 145.0, 433.4, 441.0, 441.0, 0.07814660302727917, 0.03896763453238275, 0.04355827782920759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 184.25, 144, 429, 149.5, 429.0, 429.0, 429.0, 0.042936191452477686, 0.033795478819040055, 0.015262474305372926], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 672.8571428571429, 149, 1315, 579.0, 1143.0, 1315.0, 1315.0, 0.0944726737791094, 0.017654317316841105, 0.06429756403897673], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1587.0, 755, 3472, 1479.0, 2919.8000000000006, 3432.0999999999995, 3472.0, 0.09813588548944105, 0.050792987606839604, 0.04513867389211595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 367.625, 288, 595, 295.5, 595.0, 595.0, 595.0, 0.0451587046225579, 0.06998717210546816, 0.10156298510327232], "isController": false}, {"data": ["addBook", 61, 7, 11.475409836065573, 1516.3934426229514, 736, 4209, 1152.0, 2633.0, 2884.8999999999996, 4209.0, 0.2844141069397042, 90.3668362806328, 1.0337512996792182], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ef0a256-3c69-4b71-aad4-27ebdc7b189d", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 276.24074074074065, 142, 599, 152.0, 575.5, 594.25, 599.0, 0.24781555180262868, 0.18416761222832073, 0.11979365052959101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59ed12ed-5929-4d77-8405-900f545894e4", 3, 0, 0.0, 377.0, 260, 608, 263.0, 608.0, 608.0, 608.0, 0.042369290738073044, 0.026853193055673248, 0.027170411052735644], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 923.6666666666665, 704, 1357, 860.0, 1205.0, 1325.0, 1357.0, 0.2475519859170426, 72.78850335914292, 0.12450124291726263], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 232.7037037037037, 141, 459, 149.0, 434.5, 453.75, 459.0, 0.2480318215640703, 0.4389000592520463, 0.12062485072158888], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1433.999999999999, 986, 2105, 1408.0, 1802.5, 2007.25, 2105.0, 0.2466170083530094, 221.90641762249788, 0.12379017802094418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 169.99999999999997, 144, 427, 153.0, 239.4000000000002, 427.0, 427.0, 0.09991507218863965, 0.0746435842034271, 0.035516685817055506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec967e8e-a6a3-4768-b8fb-b6506f12fb1d", 1, 0, 0.0, 1167.0, 1167, 1167, 1167.0, 1167.0, 1167.0, 1167.0, 0.8568980291345331, 0.15481067909168808, 0.5907910239931448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, 3.977272727272727, 243.60227272727263, 144, 2060, 157.0, 420.20000000000016, 559.8500000000001, 2043.8299999999997, 0.766400313527401, 1.6253602707439743, 0.3709232252498421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 186.7777777777778, 144, 454, 152.0, 454.0, 454.0, 454.0, 0.07086725775209059, 0.05488060097403109, 0.02519109552906345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0efdeb3f-9161-4dcb-8280-22ed4621a002", 3, 0, 0.0, 356.3333333333333, 235, 550, 284.0, 550.0, 550.0, 550.0, 0.022053958685584064, 0.03040316244578402, 0.01414267532897155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59ed12ed-5929-4d77-8405-900f545894e4", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdc6a569-c421-45ce-aed3-2dcd90b0b1cd", 3, 0, 0.0, 710.3333333333334, 332, 1350, 449.0, 1350.0, 1350.0, 1350.0, 0.04725823474740474, 0.039289561049762924, 0.030305573714969832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/332ad49f-38c5-48ff-9e69-7155486b9224", 3, 0, 0.0, 408.6666666666667, 257, 492, 477.0, 492.0, 492.0, 492.0, 0.09508113590263692, 0.04302173792469574, 0.06097325446881339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 153.6470588235294, 145, 179, 152.0, 165.39999999999998, 179.0, 179.0, 0.09392732235304517, 0.07622422351111381, 0.03338822786768403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8975bb4-39a0-4051-aafe-bae1b33e7b91", 3, 0, 0.0, 573.6666666666666, 238, 971, 512.0, 971.0, 971.0, 971.0, 0.026240520611928938, 0.0263173971371592, 0.01682741718929037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 452.8888888888889, 287, 851, 303.0, 851.0, 851.0, 851.0, 0.07054784319566053, 0.10933537807764966, 0.15866375281211542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86910bd3-3cf4-4be4-8c8f-10508b7b2802", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.5641977694346291, 1.0542043948763251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/225469c2-6278-4451-9f23-fa36d977bc27", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 609.6153846153846, 287, 1793, 303.0, 1771.0, 1793.0, 1793.0, 0.07807385786954459, 14.472149637932485, 0.17251671643875108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 204.84615384615384, 144, 516, 153.0, 497.2, 516.0, 516.0, 0.05988879112171706, 0.049653890295251746, 0.02128859371904786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 155.16666666666666, 143, 199, 151.0, 177.40000000000003, 199.0, 199.0, 0.0919920886803735, 0.07141963916103215, 0.03270031277310151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc5ed44b-1f5c-4600-8980-baf301b0e413", 3, 0, 0.0, 473.66666666666663, 292, 787, 342.0, 787.0, 787.0, 787.0, 0.026043927424255577, 0.02612022799288133, 0.016701346688080564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25457ed7-c9bc-4f03-9b36-590482fbeb70", 3, 0, 0.0, 687.3333333333333, 339, 1315, 408.0, 1315.0, 1315.0, 1315.0, 0.01973151978742576, 0.027201492936115918, 0.0126533509053479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 148.68750000000003, 141, 157, 147.5, 155.6, 157.0, 157.0, 0.0954933124839601, 0.07096719804716177, 0.047933166617925294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 200.81250000000003, 141, 446, 149.5, 442.5, 446.0, 446.0, 0.09550015220336758, 0.034518548666280686, 0.05396364801628278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 287.12500000000006, 140, 1544, 147.5, 771.9000000000008, 1544.0, 1544.0, 0.09549730220121282, 5.394670812219476, 0.05562904371389008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 245.9375, 142, 877, 149.0, 571.1000000000004, 877.0, 877.0, 0.09550129225186078, 1.7791662252218912, 0.055724630977037906], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 35.294117647058826, 0.4618937644341801], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07698229407236336], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07698229407236336], "isController": false}, {"data": ["401/Unauthorized", 9, 52.94117647058823, 0.6928406466512702], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 17, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
